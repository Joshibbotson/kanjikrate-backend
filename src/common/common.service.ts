import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';

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

  public async create(createDto: CreateType): Promise<ReadType> {
    const createdData = new this.model(createDto);
    return createdData.save() as unknown as ReadType;
  }
}
