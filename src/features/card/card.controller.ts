import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Card, createCardResponse, readCardByIdResponse } from './card.schema';
import { CardService } from './card.service';
import { CreateCardDto, IReadCard } from './card.types';
import { IResponse } from 'src/features/common/common.types';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

ApiTags('Card');
@ApiExtraModels(Card)
@Controller('card')
export class CardController {
  constructor(private readonly _cardService: CardService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create a new card', operationId: 'createCard' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created Card',
    type: Card,
  })
  @ApiResponse({ status: 500, description: 'Failed to create card' })
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
