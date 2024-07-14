import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  Card,
  createCardResponse,
  readCardByFieldResponse,
  readCardByIdResponse,
  reviewCardByIdResponse,
} from './card.schema';
import { CardService } from './card.service';
import { CreateCardDto, IReadCard, ReviewCardDto } from './card.types';
import { IResponse, ReadByFieldDto } from 'src/features/common/common.types';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('Card')
@ApiExtraModels(Card)
@Controller('card')
export class CardController {
  constructor(private readonly _cardService: CardService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create a new card', operationId: 'createCard' })
  @ApiResponse(createCardResponse.success)
  @ApiResponse(createCardResponse.error)
  async create(
    @Body() createCardDto: CreateCardDto,
  ): Promise<IResponse<IReadCard>> {
    try {
      const data = await this._cardService.create(createCardDto);
      return {
        code: 200,
        success: true,
        message: 'Successfully created Card',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to create card with an error of: ${err.message}`,
        data: null,
      };
    }
  }

  @Post('readByField')
  @ApiOperation({
    summary: 'Read card by field',
    operationId: 'readCardByField',
  })
  @ApiResponse(readCardByFieldResponse.success)
  @ApiResponse(readCardByFieldResponse.error)
  public async readbyField(
    @Body() opts: ReadByFieldDto,
  ): Promise<IResponse<IReadCard[]>> {
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

      const { data, totalCount } = await this._cardService.findByField(query, {
        ...opts,
      });
      return {
        code: 200,
        success: true,
        message: `Successfully read Cards by Field: ${opts.field}`,
        data,
        totalCount,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to read Cards by field with an error of: ${err.message}`,
        data: null,
      };
    }
  }

  @Put('reviewCard/:id')
  @ApiOperation({
    summary: 'Review a card by ID and score',
    operationId: 'reviewCardById',
  })
  @ApiResponse(reviewCardByIdResponse.success)
  @ApiResponse(reviewCardByIdResponse.error)
  async reviewCardById(
    @Param('id') id: string,
    @Body() reviewCardDto: ReviewCardDto,
  ): Promise<IResponse<IReadCard>> {
    console.log('reviewCard/:id hit', id);
    try {
      const data = await this._cardService.reviewCard(id, reviewCardDto.score);
      return {
        code: 200,
        success: true,
        message: 'Successfully read Card',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to read card with an error of: ${err.message}`,
        data: null,
      };
    }
  }

  @Get('readById/:id')
  @ApiOperation({ summary: 'Read a card by ID', operationId: 'readCardById' })
  @ApiResponse(readCardByIdResponse.success)
  @ApiResponse(readCardByIdResponse.error)
  async readById(@Param('id') id: string): Promise<IResponse<IReadCard>> {
    try {
      const data = await this._cardService.findById(id);
      return {
        code: 200,
        success: true,
        message: 'Successfully read Card',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to read card with an error of: ${err.message}`,
        data: null,
      };
    }
  }
}
