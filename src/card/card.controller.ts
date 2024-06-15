import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Card } from './card.schema';
import { CardService } from './card.service';
import { CreateCardDto } from './card.types';
import { Response } from 'src/common/common.types';

@Controller('card')
export class CardController {
  constructor(private readonly _cardService: CardService) {}
  @Post('create')
  async create(@Body() createCardDto: CreateCardDto): Promise<Response<Card>> {
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
  async readById(@Param('id') id: string): Promise<Response<Card>> {
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
