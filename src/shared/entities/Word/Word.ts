//import _ from 'lodash';
//export type { IVocaRow } from 'backend/VocaSqlite';
//import "reflect-metadata"
import Tempus from '@shared/Tempus';
import { $, compileTs, lastOf, lodashMerge, simpleUnion } from '@shared/Ut';
//import _, { last } from 'lodash';
import _ from 'lodash';
import { WordPriority } from '@shared/entities/Word/WordPriority';
import { WordDbRow } from '@shared/DbRow/Word';
//const sros = Sros.new<Sros_number>()
// const sros = Sros.new({})
// const $n = sros.createNumber.bind(sros)


const Ut = {
	union : simpleUnion
};

export type IVocaRow = WordDbRow



/**
 * 單詞事件枚舉
 */
export enum WordEvent{
	ADD=0, // add
	RMB=1, // remember
	FGT=-1	// forget
}

export class Word{
	/**
	 * 空例
	 */
	public static readonly example = new Word({
		table:'', wordShape: '', mean:[],dates_add:[]
	})

	/**
	 * @deprecated
	 * @param props 
	 */
	public constructor(props:{
		id?:number,
		table:string,
		wordShape:string,
		variant?:string[],
		pronounce?:string[],
		mean:string[],
		tag?:string[],
		annotation?:string[],
		dates_add:Tempus[] 
		dates_rmb?:Tempus[]
		dates_fgt?:Tempus[]
		source?:string[]
	}){
		this._id=props.id
		this._table=props.table
		this._wordShape=props.wordShape
		this._variant=props.variant?.slice()??[]
		this._pronounce = props.pronounce?.slice()??[]
		this._mean=props.mean.slice()
		this._annotation=props.annotation?.slice()??[]
		this._tag=props.tag?.slice()??[]
		this._dates_add=props.dates_add.slice()
		this._dates_rmb = props.dates_rmb?.slice()??[]
		this._dates_fgt = props.dates_fgt?.slice()??[]
		this._source = props.source?.slice()??[]
	}

	static new(props:{
		id?:number,
		table:string,
		wordShape:string,
		variant?:string[],
		pronounce?:string[],
		mean:string[],
		tag?:string[],
		annotation?:string[],
		dates_add:Tempus[] 
		dates_rmb?:Tempus[]
		dates_fgt?:Tempus[]
		source?:string[]
	}){
		//@ts-ignore
		const o = new this()
		o._id=props.id
		o._table=props.table
		o._wordShape=props.wordShape
		o._variant=props.variant?.slice()??[]
		o._pronounce = props.pronounce?.slice()??[]
		o._mean=props.mean.slice()
		o._annotation=props.annotation?.slice()??[]
		o._tag=props.tag?.slice()??[]
		o._dates_add=props.dates_add.slice()
		o._dates_rmb = props.dates_rmb?.slice()??[]
		o._dates_fgt = props.dates_fgt?.slice()??[]
		o._source = props.source?.slice()??[]
		return o
	}


	/**
	 * 所屬ᵗ表
	 */
	protected _table:string = ''
	;public get table(){return this._table;};

	protected _id?:number
	;public get id(){return this._id;};

	/**
	 * 詞形
	 */
	protected _wordShape:string=''
	;public get wordShape(){return this._wordShape;};

	/**
	 * 變形
	 * 始于2024-01-13T10:48:35.000+08:00
	 */
	protected _variant:string[] = []
	get variant(){return this._variant}

	/**
	 * 意
	 */
	protected _mean:string[] = []
	;public get mean(){return this._mean;};

	/**
	 * 音
	 */
	protected _pronounce:string[] = []
	;public get pronounce(){return this._pronounce;};

	/**
	 * 用戶手動畀單詞加之註、在源txt詞表中用<<>>括着ᵗ部。
	 */
	protected _annotation:string[] = []
	;public get annotation(){return this._annotation;};

	/**
	 * 標籤。用戶ˋ定ᶦ。可潙四六級詞之屬。
	 */
	protected _tag:string[] = []
	;public get tag(){return this._tag;};

	/**
	 * 添ᵗ日期
	 */
	protected _dates_add:Tempus[] = []
	;public get dates_add(){return this._dates_add;};

	/**
	 * 添ᵗ次
	 */
	;public get times_add(){
		return this.dates_add.length;
	}

	/**
	 * remember
	 */
	protected _dates_rmb:Tempus[]=[]
	;public get dates_rmb(){return this._dates_rmb;};

	public get times_rmb(){
		return this.dates_rmb.length
	}

	/**
	 * forget
	 */
	protected _dates_fgt:Tempus[] = []
	;public get dates_fgt(){return this._dates_fgt;};

	public get times_fgt(){
		return this.dates_fgt.length
	}

	/**
	 * ʃᙆ添。可潙書名等。
	 */
	protected _source:string[] = []
	;public get source(){return this._source;};

	
	// public toRowObj(){
	// 	return SingleWord2.fieldStringfy(this)
	// }

	static toJsObj = WordDbRow.toEntity.bind(WordDbRow)
	static toDbObj = WordDbRow.toPlain.bind(WordDbRow)

	/**
	 * 複製對象
	 * @param o 
	 */
	public static clone(o:Word):Word
	public static clone(o:IVocaRow):IVocaRow
	public static clone(o:Word|IVocaRow){
		if(o instanceof Word){
			return Word.toJsObj(Word.toDbObj(o))
		}else{
			return Word.toDbObj(Word.toJsObj(o))
		}
	}


	/**
	 * 合併兩個同詞形之單詞對象、id取前者。
	 * @param w1 
	 * @param w2 
	 * @returns 
	 */
	public static intersect(w1:Word, w2:Word){
		if(w1.wordShape!==w2.wordShape){
			console.error(w1);console.error(w2)
			throw new Error(`w1.wordShape !== w2.wordShape`)
		}
		if(w1.table!==w2.table){
			console.error(w1);console.error(w2)
			throw new Error(`w1.ling!==w2.ling`)
		}
		let o = new Word({
			id:w1.id,
			table:w1.table,
			wordShape:w1.wordShape,
			mean:Ut.union(w1.mean, w2.mean),
			annotation:Ut.union(w1.annotation, w2.annotation),
			tag:Ut.union(w1.tag, w2.tag),
			dates_add:tempusUnion(w1.dates_add, w2.dates_add),
			dates_rmb:tempusUnion(w1.dates_rmb, w2.dates_rmb),
			dates_fgt:tempusUnion(w1.dates_fgt, w2.dates_fgt),
		})
		return o

		function tempusUnion(a:Tempus[], b:Tempus[]){
			const aStrArr = a.map(e=>e.iso)
			const bStrArr = b.map(e=>e.iso)
			const uni = Ut.union(aStrArr, bStrArr)
			return uni.map(e=>Tempus.new(e))
		}
	}

	/**
	 * 批量合併單詞數組
	 * @param ws 
	 * @returns 
	 */
	public static merge(ws:Word[]){
		let map = new Map<string, Word>()
		for(const neoWord of ws){
			let old = map.get(neoWord.wordShape)
			if(old !== void 0){
				let united = Word.intersect(old,neoWord)
				map.set(united.wordShape, united)
			}else{
				map.set(neoWord.wordShape, neoWord)
			}
		}
		return Array.from(map.values())
	}

	/**
	 * 複製成IVocaRow並刪id後 用JSON.stringfy()比較兩IVocaRow是否相同
	 * @param row1 
	 * @param row2 
	 * @param ignoredKeys 忽略之字段
	 */
	public static isWordsEqual(row1: IVocaRow, row2:IVocaRow, ignoredKeys?:string[]):boolean
	public static isWordsEqual(row1: Word, row2:Word,ignoredKeys?:string[]):boolean

	public static isWordsEqual(row1: IVocaRow|Word, row2:IVocaRow|Word, ignoredKeys?:string[]){
		let c1:IVocaRow
		let c2:IVocaRow
		if(row1 instanceof Word){
			c1 = Word.toDbObj(row1)
			c2 = Word.toDbObj(row2 as Word)
		}else{
			c1 = this.clone(row1)
			c2 = this.clone(row2 as IVocaRow)
		}
		if(ignoredKeys !== void 0){
			for(const k of ignoredKeys){
				//console.log(k)//t
				delete (c1)[k]
				delete (c2)[k]
			}
			
		}

		return JSON.stringify(c1) === JSON.stringify(c2)
	}

	/**
	 * 
	 * @param sws 依table對SingleWord2數組分類
	 * @returns 
	 */
	public static classify(sws:Word[]){
		const tableToWordsMap = new Map<string, Word[]>()
		for(const wordToAdd of sws){
			const innerWords = tableToWordsMap.get(wordToAdd.table)
			if(innerWords === void 0){
				tableToWordsMap.set(wordToAdd.table, [wordToAdd])
			}else{
				innerWords.push(wordToAdd)
				tableToWordsMap.set(wordToAdd.table, innerWords)
			}
		}
		return tableToWordsMap
	}

	// public static is_properSetOf_(w1:SingleWord2, w2:SingleWord2){
		
	// }

	/**
	 * 對 日期-事件 依日期 排序。
	 * @param sw 
	 * @returns 
	 */
	public static getSortedDateToEventObjs(sw:Word): Tempus_Event[]{
		const addMap = Word.getDateToEventMap(sw.dates_add, WordEvent.ADD)
		const rmbMap = Word.getDateToEventMap(sw.dates_rmb, WordEvent.RMB)
		const fgtMap = Word.getDateToEventMap(sw.dates_fgt, WordEvent.FGT)
		const merged = new Map([...addMap, ...rmbMap, ...fgtMap])
		//let mapObj = mapToObjArr(merged)
		let mapObj:Tempus_Event[] = []
		for(const [k,v] of merged){
			//let unus = Tempus.new_Event(k,v)
			let unus = new Tempus_Event(k,v)
			mapObj.push(unus)
		}
		mapObj.sort((a,b)=>{return Tempus.diff_mills(a.tempus,b.tempus)})
		return mapObj
	}

	/**
	 * 取日期對事件之映射
	 * @param dates 
	 * @param event 
	 * @returns 
	 */
	public static getDateToEventMap(dates:Tempus[], event:WordEvent){
		const map = new Map<Tempus, WordEvent>()
		for(const d of dates){
			map.set(d,event)
		}
		return map
	}


/* 
	public static intersectTwoWord(w1:IVocaRow, w2:IVocaRow){
		let c = VocaTableColumnName
		function unionStringfiedArr<T>(s1:string, s2:string){
			let arr1:T[] = JSON.parse(s1)
			let arr2:T[] = JSON.parse(s2)
			return JSON.stringify(Ut.union(arr1, arr2))
		}
		function batchKeys(w1:IVocaRow,w2:IVocaRow,keys:string[]){
			let obj:IVocaRow = JSON.parse(JSON.stringify(w1))
			for(const k of keys){
				obj[k]=unionStringfiedArr(w1[k], w2[k])
			}
			return obj
		}
		if(w1.wordShape !== w2.wordShape){
			console.error(w1);console.error(w2)
			throw new Error(`w1.wordShape !== w2.wordShape`)
		}
		batchKeys(w1, w2, [c.mean, c.dates_add, c.dates_rmb, c.dates_fgt])
		//待改:唯與數據庫存取詞旹 用IVocaRowˉ接口、処理單詞旹皆當用SingleWord2對象
	}
 */
	//public static 

	/**
	 * 根據事件ⁿ珩函數數組
	 * @param event 
	 * @param fn 
	 */
	public static switchEvent(event:WordEvent, fn:(Function|undefined)[]){
		switch (event){
			case WordEvent.ADD:$(fn[0])();break;
			case WordEvent.RMB:$(fn[1])();break;
			case WordEvent.FGT:$(fn[2])();break
			default: throw new Error('default');
		}
	}

}
/**
 * 日期對事件
 */
export class Tempus_Event{
	public constructor(public tempus:Tempus, public event:WordEvent){

	}
}

export{WordPriority as Priority}