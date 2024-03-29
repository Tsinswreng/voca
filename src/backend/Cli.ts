import 'tsconfig-paths/register'
import readline = require('readline');
import { Abortable } from 'events';
import { createInterface as createInterface, question_fn } from './util/readLine';
import {WordDbSrc} from './db/sqlite/Word/DbSrc';
import { Word } from '@shared/entities/Word/Word';
import Config from '@shared/Config';
import { WordTable } from './db/sqlite/Word/Table';
import Sqlite from './db/Sqlite';

const configInst = Config.getInstance()
const config = configInst.config

export class Cli{

	protected _wordsToLearn: Word[]
	get wordsToLearn(){return this._wordsToLearn}

	protected _wordDbSrc:WordDbSrc
	get wordDbSrc(){return this._wordDbSrc}

	protected constructor(){

	}
	
	static async New(){
		const o = new this()
		o.init()
		return o
	}

	async init(){
		const z = this
		z._wordDbSrc = await WordDbSrc.New({
			_dbPath: config.dbPath
		})
	}

	exput(v?){
		console.log(v)
	}

	async main(){
		const z = this
		console.log(
			process.argv
		)
		let rl = createInterface()
		const question = question_fn(rl, '')
		
		for(let i = 0;;i++){
			let str = await question('')
			z.exput(str)
			if(str === 'loadEng'){
				const engTbl = z.wordDbSrc.loadTable('eng')
				//Sqlite.sel
			}
		}
	}
}

async function main(){
	const cli = await Cli.New()
	cli.main()
}
main()





/* 
"d:\_code\voca\src\backend\Cli.ts"
"d:\_code\voca\out\backend\Cli.js"
*/