import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto, IReadDeck } from './deck.types';
import {
  Deck,
  createDeckResponse,
  readDeckByFieldResponse,
  readDeckByIdResponse,
} from './deck.schema';
import { IResponse, ReadByFieldDto } from 'src/features/common/common.types';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('Deck')
@ApiExtraModels(Deck)
@Controller('deck')
export class DeckController {
  constructor(private readonly _deckService: DeckService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create a deck', operationId: 'createDeck' })
  @ApiResponse(createDeckResponse.success)
  @ApiResponse(createDeckResponse.error)
  async create(
    @Body() createDeckDto: CreateDeckDto,
  ): Promise<IResponse<IReadDeck>> {
    try {
      const data = await this._deckService.create(createDeckDto);
      return {
        code: 200,
        success: true,
        message: 'Successfully created Deck',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to create deck with an error of: ${err.message}`,
        data: null,
      };
    }
  }

  // add in readMany, readByField

  @Post('readByField')
  @ApiOperation({
    summary: 'Read deck by field',
    operationId: 'readDeckByField',
  })
  @ApiResponse(readDeckByFieldResponse.success)
  @ApiResponse(readDeckByFieldResponse.error)
  public async readbyField(
    @Body() opts: ReadByFieldDto,
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<IResponse<IReadDeck[]>> {
    console.log('opts:', opts);
    try {
      const { boolValue, stringValue, intValue, field, objectId } = opts;
      let value;

      if (boolValue !== undefined) {
        value = boolValue ? true : false;
      } else if (stringValue) {
        value = stringValue;
      } else if (intValue !== undefined) {
        value = Number(intValue);
      } else if (objectId) {
        value = new Types.ObjectId(objectId);
      }

      if (value === undefined) {
        throw new Error('No value, must assign value');
      }

      const query = { [field]: value };

      const { data, totalCount } = await this._deckService.findByField(query, {
        take,
        skip,
        populate: 'cards',
      });
      console.log('controlelr', totalCount);
      return {
        code: 200,
        success: true,
        message: `Successfully read Decks by Field: ${opts.field}`,
        data,
        totalCount,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to read decks by field with an error of: ${err.message}`,
        data: null,
      };
    }
  }

  @Get('readById/:id')
  @ApiOperation({ summary: 'Read deck by Id', operationId: 'readDeckById' })
  @ApiResponse(readDeckByIdResponse.success)
  @ApiResponse(readDeckByIdResponse.error)
  async readById(@Param('id') id: string): Promise<IResponse<IReadDeck>> {
    console.log('readById', id);
    try {
      const data = await this._deckService.findById(id);
      return {
        code: 200,
        success: true,
        message: 'Successfully read Deck',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to read deck with an error of: ${err.message}`,
        data: null,
      };
    }
  }
}
