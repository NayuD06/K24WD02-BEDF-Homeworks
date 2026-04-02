import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    return this.bookModel.create({
      title: createBookDto.title,
      author: createBookDto.author,
      category: createBookDto.category,
      available: createBookDto.available ?? true,
    });
  }

  async findAll() {
    return this.bookModel.find().sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Book id không hợp lệ.');
    }

    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Không tìm thấy sách với id=${id}.`);
    }

    return book;
  }

  async searchByCategory(category: string) {
    if (!category?.trim()) {
      throw new BadRequestException('Vui lòng truyền query param category.');
    }

    return this.bookModel
      .find({ category: new RegExp(`^${category}$`, 'i') })
      .sort({ createdAt: 1 })
      .exec();
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    await book.save();
    return book;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Book id không hợp lệ.');
    }

    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException(`Không tìm thấy sách với id=${id}.`);
    }

    return {
      message: 'Xóa sách thành công.',
      book: deletedBook,
    };
  }

  async borrow(id: string, userId: number) {
    const book = await this.findOne(id);
    if (!book.available) {
      throw new BadRequestException('Sách hiện không khả dụng để mượn.');
    }

    book.available = false;
    await book.save();

    return {
      message: `Mượn sách thành công bởi user id=${userId}.`,
      book,
    };
  }
}
