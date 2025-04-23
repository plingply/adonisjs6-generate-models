import { BaseCommand, args } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Model from '../src/model/index.js'
import { schema } from '../src/db/schema.js'
import { stubsRoot } from '../stubs/main.js'

export default class GenerateModels extends BaseCommand {
  static commandName = 'generate:models'
  static description = 'Generate model files from an existing database'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: '表名称', required: false })
  declare tableName: string

  async run() {
    const codemods = await this.createCodemods()
    const db = await this.app.container.make('lucid.db')
    const tables = await schema(db)
    const models = Model.build(tables)

    if(this.tableName) {
      for (let model of models) {
        if(model.tableName === this.tableName) {
          await codemods.makeUsingStub(stubsRoot, 'generate/model.stub', { model })
        }
      }
      return
    }
    for (let model of models) {
      await codemods.makeUsingStub(stubsRoot, 'generate/model.stub', { model })
    }
  }
}
