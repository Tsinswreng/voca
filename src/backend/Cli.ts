import 'tsconfig-paths/register'
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import {WordDbSrc} from './db/sqlite/Word/DbSrc';
import { Word } from '@shared/entities/Word/Word';
import Config from '@shared/Config';
import { WordTable } from './db/sqlite/Word/Table';
import Sqlite from './db/Sqlite';
import * as Le from '@shared/linkedEvent'
import { MemorizeEvents } from '@shared/logic/memorizeWord/Event';
import { CliMemorize } from './logic/CliMemorize';
import { MemorizeWord } from '@shared/entities/Word/MemorizeWord';
import { Exception } from '@shared/Exception';


const configInst = Config.getInstance()
const config = configInst.config

/** 表示層 */
export class Cli{

	protected _wordsToLearn: Word[]
	get wordsToLearn(){return this._wordsToLearn}

	protected _wordDbSrc:WordDbSrc
	get wordDbSrc(){return this._wordDbSrc}

	protected constructor(){

	}
	
	static async New(){
		const o = new this()
		o._cliMemorize = await CliMemorize.New()
		o.initEvents()
		return o
	}

	readonly This = Cli

	static get Cmd(){
		class Cmd{
			protected constructor(){}
			static new(cli:Cli){
				const o = new this()
				o.cli = cli
				return o
			}
			cli:Cli
			echoConfig(){
				const z = this.cli
				z.exput(z.configInst.config)
			}
			reloadConfig(){
				const z = this.cli
				z._configInst.reload()
			}
			wordCnt(){
				const z = this.cli
				z.exput(z.cliMemorize.wordsToLearn.length)
			}
		}
		return Cmd
	}

	protected _cmd = this.This.Cmd.new(this)
	get cmd(){return this._cmd}

	protected _configInst = configInst
	get configInst(){return this._configInst}

	protected _cliMemorize: CliMemorize
	get cliMemorize(){return this._cliMemorize}

	//str__fn = new Map<string, Function>()
	str__event = new Map<string, Le.Event>()

	str__fn = new Map<string, Function>()

	

	initEvents(){
		const z = this
		//z.str__fn.set
		const es = z.cliMemorize.This.events
		z.str__event = new Map([
			['load', es.load]
			,['start', es.start]
		])
	}

	initCmd(){
		const z = this
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

	handleErr(v){
		if(v instanceof Exception){
			console.error(v)
			console.error('Exception')
		}else{
			console.error(v)
		}
	}

	async main(){
		const z = this
		console.log(process.argv)
		let rl = createInterface()
		const question = question_fn(rl, '')
		z.cliMemorize.emitter.on(z.cliMemorize.This.events.error, (error)=>{
			z.handleErr(error)
		})
		for(let i = 0; ; i++){
			try {
				let imput = await question('')
				let cmd = z.cmd[imput]
				if(cmd != void 0){
					cmd = cmd.bind(z.cmd)
					cmd()
					continue
				}
	
				const event = z.str__event.get(imput)
				if(event == void 0){
					z.exput('illegal input')
					continue
				}
				z.cliMemorize.emitter.emit(event)
			} catch (error) {
				z.handleErr(error)
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