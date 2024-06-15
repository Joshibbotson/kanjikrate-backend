import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './deck.types';
import { Deck } from './deck.schema';
import { Response } from 'src/common/common.types';

@Controller('deck')
export class DeckController {
  constructor(private readonly _deckService: DeckService) {}
  @Post('create')
  async create(@Body() createDeckDto: CreateDeckDto): Promise<Response<Deck>> {
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

  @Get('readById/:id')
  async readById(@Param('id') id: string): Promise<Response<Deck>> {
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
