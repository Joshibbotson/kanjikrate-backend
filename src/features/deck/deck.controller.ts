import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './deck.types';
import { Deck, createDeckResponse, readDeckByIdResponse } from './deck.schema';
import { IResponse } from 'src/features/common/common.types';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

ApiTags('Deck');
@Controller('deck')
export class DeckController {
  constructor(private readonly _deckService: DeckService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create a deck', operationId: 'createDeck' })
  @ApiResponse(createDeckResponse.success)
  @ApiResponse(createDeckResponse.error)
  async create(@Body() createDeckDto: CreateDeckDto): Promise<IResponse<Deck>> {
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
  @ApiOperation({ summary: 'Read deck by Id', operationId: 'readDeckById' })
  @ApiResponse(readDeckByIdResponse.success)
  @ApiResponse(readDeckByIdResponse.error)
  async readById(@Param('id') id: string): Promise<IResponse<Deck>> {
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
