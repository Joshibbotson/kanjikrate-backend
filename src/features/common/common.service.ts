import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FilterQuery, Model, Types } from 'mongoose';
import { IReadOpts } from './common.types';
import { IUser } from '../user/user.types';

@Injectable()
export abstract class CommonService<CreateType, ReadType, DocumentType> {
  constructor(
    protected model: Model<DocumentType>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async findById(id: string): Promise<ReadType | null> {
    const cacheKey = `findById_${id}`;
    let data = await this.cacheManager.get(cacheKey);
    console.log('Current cache keys:', this.cacheManager.store.keys());
    console.log('Cached data:', data);

    if (!data) {
      data = await this.model.findById(new Types.ObjectId(id)).exec();
      if (data) {
        await this.cacheManager.set(cacheKey, data);
        console.log('Cached data set:', await this.cacheManager.get(cacheKey));
        console.log('Updated cache keys:', this.cacheManager.store.keys());
      }
    }

    return data as unknown as ReadType;
  }

  public async findOne(query: FilterQuery<IUser>): Promise<IUser | null> {
    const cacheKey = `findOne_${JSON.stringify(query)}`;
    const data = await this.cacheManager.get<IUser>(cacheKey);
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

  public async findByField(
    query: FilterQuery<ReadType>,
    opts: IReadOpts,
  ): Promise<ReadType[] | null> {
    const cacheKey = `findByField_${query}`;
    let data = await this.cacheManager.get(cacheKey);
    console.log('findByField', query);
    if (!data) {
      data = await this.model
        .find(query)
        .populate(opts.populate)
        .skip(opts.skip || 0)
        .limit(opts.take || 20)
        .exec();
      console.log('findByField', data);
    }
    if (data) {
      await this.cacheManager.set(cacheKey, data);
    } else {
      return null;
    }
    return data as unknown as ReadType[];
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
