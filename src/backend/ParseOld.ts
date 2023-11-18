require('module-alias/register');
import { IVocaRow } from "@shared/SingleWord2"
import Ut, { $, $a } from "@shared/Ut"
import moment from "moment"
import VocaSqlite from "./VocaSqlite"
import SingleWord2 from "@shared/SingleWord2"
import Tempus from "@shared/Tempus"
import VocaRaw from './VocaRaw'
import Sqlite from "@shared/db/Sqlite";

/**
 * 舊版ᵗ詞表
 */
export interface Old_IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	ling:string //數據庫中本無此字段、㕥存表名。
	wordShape:string
	fullComments:string
	//annotation:string //
	addedTimes:number
	addedDates:string
	reviewedDates:string //皆 空數組也
	reviewedTimes:number // 皆 0
	rememberedTimes:number
	rememberedDates:string
	forgottenTimes:number
	forgottenDates:string
}

//<蠹>{盡刪表後加詞只能加一個, 既有表 重複加詞旹times_add益增}
export default class ParseOld{

	public static async tableMigrate(oldTable:string, neoTable:string){
		const oldWords = await VocaRaw.getAllWords(oldTable)
		const neoWords = ParseOld.parseOldObj(oldWords as any, neoTable)
		$a(neoWords)
		//console.log(`console.log(neoWords[0])`)
		//console.log(neoWords[0])//t
		const lite = new VocaSqlite({
			_dbName: 'voca',
			_tableName: neoTable
		})
		await lite.creatTable(lite.tableName,true)
		//console.log(`console.log(SingleWord2.parse(neoWords)[0])`)
		//console.log(SingleWord2.parse(neoWords)[0])//t
		return lite.addWordsOfSameTable(SingleWord2.parse(neoWords))
	}

	public static async run(){
		try{
			let engIds = await ParseOld.tableMigrate('eng', 'migrate_english').catch((e)=>{console.error(e)})
			console.log(`console.log(engIds[0])`)
			console.log(engIds[0])
			console.log(`console.log(engIds[1])`)
			console.log(engIds[1])
			let japIds = await ParseOld.tableMigrate('jap', 'migrate_japanese')
			console.log(`console.log(japIds[0])`)
			console.log(japIds[0])
			console.log(`console.log(japIds[1])`)
			console.log(japIds[1])
			console.log(`done`)
		}catch(e){
			console.error(e)
			//throw e
		}

	}


	/**
	 * 舊對象轉新對象
	 * @param objs 
	 * @returns 
	 */
	public static parseOldObj(objs:Old_IVocaRow[], neoTableName:string){

		// let lingMap = new Map([
		// 	['eng', 'english'],
		// 	['jap', 'japanese'],
		// ])

		const r:IVocaRow[]=[]
		for(const e of objs){
			const t = parseOne(e)
			r.push(t)
		}
		return r

		function parseOne(obj:Old_IVocaRow){
			//console.log(obj)//t
			let neo:IVocaRow = {
				id:obj.id,
				//table: $(lingMap.get(obj.ling)),
				table: neoTableName,
				wordShape:obj.wordShape,
				//mean:JSON.stringify(obj.fullComments),
				mean: obj.fullComments,
				annotation:'[]',
				tag: '[]',
				dates_add: convertDate(obj.addedDates),
				dates_rmb: convertDate(obj.rememberedDates), 
				dates_fgt: convertDate(obj.forgottenDates),
				times_add: obj.addedTimes,
				times_rmb: obj.rememberedTimes,
				times_fgt: obj.forgottenTimes,
				source: '[]',
				pronounce: '[]'
				
			}

			return neo
		}

		//YYYYMMDDHHmmss 字串數組 轉 JSON格式ᵗ YYYY.MM.DD-HH:mm:ss.SSS 數字數組
		function convertDate(old:string){
			//let neo = Ut.convertDateFormat(old, 'YYYYMMDDHHmmss', 'YYYYMMDDHHmmssSSS')
			//return JSON.stringify(neo)
			let oldArr = JSON.parse(old) as string[]
			let neo:string[] = []
			for(const e of oldArr){
				//console.log(`console.log(e)//t`)
				//console.log(e)//t
				let t = Tempus.new(e, 'YYYYMMDDHHmmss')
				neo.push(t.iso)
			}
			return JSON.stringify(neo)
		}

		/* //YYYYMMDDHHmmss 字串數組 轉 JSON格式ᵗ YYYYMMDDHHmmssSSS 數字數組
		function deprecated_convertDate(old:string[]){
			//let neo = Ut.convertDateFormat(old, 'YYYYMMDDHHmmss', 'YYYYMMDDHHmmssSSS')
			//return JSON.stringify(neo)
			let neo:string[] = []
			for(const e of old){
				let n = parseInt(e)
				n *= 1000
				neo.push(n+'')
			}
			return JSON.stringify(neo)
		} */

	}
}

ParseOld.run()