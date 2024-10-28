import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theme } from './schemas/theme.schema';
@Injectable()
export class ThemesService {
  constructor(@InjectModel(Theme.name) private themeModel: Model<Theme>) {}

  async get() {
    const themes = await this.themeModel.find();
    return themes;
  }
}
