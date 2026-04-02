import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { Public } from '../common/decorators/public.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Public()
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Public()
  @Get('search')
  search(@Query('category') category: string) {
    return this.booksService.searchByCategory(category);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Roles(Role.Member, Role.Admin)
  @Post(':id/borrow')
  borrow(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.booksService.borrow(id, Number(user.sub));
  }
}
