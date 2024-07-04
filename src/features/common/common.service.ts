import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FilterQuery, Model, Types } from 'mongoose';
import { IReadOpts } from './common.types';

@Injectable()
export abstract class CommonService<
  CreateType,
  ReadType,
  ReadManyAndCountType,
  DocumentType,
> {
  constructor(
    protected model: Model<DocumentType>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async findById(id: string): Promise<ReadType | null> {
    const cacheKey = `findById_${id}`;
    console.log(`Looking for cache key: ${cacheKey}`);

    let data = await this.cacheManager.get(cacheKey);
    console.log('Current cache keys:', await this.cacheManager.store.keys());
    console.log('Cached data:', data);

    if (!data) {
      console.log(`Data not found in cache for key: ${cacheKey}`);
      try {
        // Validate the ID
        if (!Types.ObjectId.isValid(id)) {
          console.error(`Invalid ObjectId: ${id}`);
          return null;
        }

        // Convert the string ID to ObjectId
        const objectId = new Types.ObjectId(id);
        console.log(`Converted ID to ObjectId: ${objectId}`);

        // Query the database
        console.log('schema:', this.model.schema);
        data = await this.model.findById(objectId).exec();
        console.log('Query executed on model:', this.model);
        console.log('Data found:', data);

        if (data) {
          await this.cacheManager.set(cacheKey, data);
          console.log('Data cached:', await this.cacheManager.get(cacheKey));
          console.log(
            'Updated cache keys:',
            await this.cacheManager.store.keys(),
          );
        } else {
          console.log(`No data found for id: ${id}`);
        }
      } catch (error) {
        console.error('Error occurred during database query:', error);
        return null;
      }
    }

    console.log('Final data returned:', data);
    return data as unknown as ReadType;
  }

  public async findOne(query: FilterQuery<ReadType>): Promise<ReadType | null> {
    const cacheKey = `findOne_${JSON.stringify(query)}`;
    const data = await this.cacheManager.get<ReadType>(cacheKey);
    console.log('cacheCheck', data);

    if (!data) {
      const dbData = await this.model.findOne(query).exec();
      console.log('findone', dbData);
      if (dbData) {
        await this.cacheManager.set(cacheKey, dbData);
        console.log('post set');
      }
      return dbData.toObject();
    }

    return data;
  }

  // update so all read manys have totalCount
  public async findByField(
    query: FilterQuery<ReadType>,
    opts: IReadOpts,
  ): Promise<ReadManyAndCountType | null> {
    const cacheKey = `findByField_${query}`;
    const cacheKeyCount = `findByFieldCount_${query}`;
    const cacheData = await this.cacheManager.get<ReadType>(cacheKey);
    const cacheTotalCount = await this.cacheManager.get<number>(cacheKeyCount);

    console.log('findByField', query);
    if (!cacheData) {
      const dbData = await this.model
        .find(query)
        .populate(opts.populate)
        .skip(opts.skip || 0)
        .limit(opts.take || 20)
        .exec();
      const totalCount = await this.model.countDocuments(query).exec();
      console.log('findByField', dbData);
      console.log('findByField count', totalCount);
      if (dbData) {
        await this.cacheManager.set(cacheKey, dbData);
        await this.cacheManager.set(cacheKeyCount, totalCount);
        return {
          data: dbData,
          totalCount: totalCount,
        } as unknown as ReadManyAndCountType;
      } else {
        return null;
      }
    }
    return {
      data: cacheData,
      totalCount: cacheTotalCount,
    } as unknown as ReadManyAndCountType;
  }

  public async create(createDto: CreateType): Promise<ReadType> {
    const createdData = new this.model(createDto);
    const savedData = await createdData.save();
    return savedData.toObject() as ReadType;
  }

  public async createMany(createDtos: CreateType[]): Promise<ReadType[]> {
    const createdData = this.model.insertMany(createDtos);
    return createdData as unknown as ReadType[];
  }

  public async update(
    id: Types.ObjectId,
    updateDto: Partial<CreateType>,
  ): Promise<ReadType | null> {
    const existingEntity = await this.model
      .findById(new Types.ObjectId(id))
      .exec();

    if (!existingEntity) {
      return null;
    }

    existingEntity.set(updateDto as DocumentType);
    const updatedEntity = await existingEntity.save();
    await this.invalidateCacheById(id.toString());
    return updatedEntity as unknown as ReadType;
  }

  public async findMany(opts: IReadOpts): Promise<ReadType[] | null> {
    const results = await this.model
      .find()
      .skip(opts.skip)
      .limit(opts.take)
      .exec();
    return results.length > 0 ? (results as ReadType[]) : null;
  }

  protected async invalidateCacheById(id: string): Promise<void> {
    const cacheKey = `findById_${id}`;
    await this.cacheManager.del(cacheKey);
  }

  public async deleteById(id: string): Promise<ReadType | null> {
    const cacheKey = `findById_${id}`;

    const data = this.cacheManager.get(cacheKey);
    if (data) {
      this.invalidateCacheById(id);
    }
    return this.model.findByIdAndDelete({ _id: id });
  }
}
