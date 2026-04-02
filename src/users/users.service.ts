import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Role } from '../common/enums/role.enum';

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    const existedUser = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (existedUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại.');
    }

    const newUser = await this.userModel.create({
      username: createUserDto.username,
      password: await hash(createUserDto.password, 10),
      roles: [Role.Member],
    });

    return {
      message: 'Đăng ký tài khoản thành công.',
      user: this.serializeUser(newUser),
    };
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.serializeUser(user));
  }

  async findOne(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với id=${id}.`);
    }

    return this.serializeUser(user);
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('User id không hợp lệ.');
    }

    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  serializeUser(user: UserDocument | User): PublicUser {
    const plain = 'toObject' in user ? user.toObject() : user;
    const { password: _password, ...safeUser } = plain;
    return safeUser;
  }
}
