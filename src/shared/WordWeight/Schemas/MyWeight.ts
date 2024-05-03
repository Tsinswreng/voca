//<@delete>
import * as L from '@shared/WordWeight/_lib'
//type import
import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { InstanceType_ } from "@shared/Type"
//</@delete>
/* 
自定義權重算法ʹ例
載入旹、程序ˋ自動 添 依賴(即 L)、勿手動ᵈ褈添
肰寫碼旹、若[不寫 import * as L from "./_lib"]則{報錯且不利代碼提示}
遂定: <@ｄｅｌｅｔｅ></@ｄｅｌｅｔｅ> 中ʹ字串ˋ 載入旹 被刪(改半角)
(正則暴力替換、不慮 配對否。)
整個文件作潙一個函數、new Function('L', code)
需return 一對象 芝叶I_WordWeightˉ 接口者
*/


const sros = L.Sros.Sros.new()
const s = sros.short
const Tempus_Event = L.Word.Tempus_Event
type Tempus_Event = InstanceType_<typeof Tempus_Event>
const WordEvent = L.Word.WordEvent
type WordEvent = L.Word.WordEvent
//type WordEvent = InstanceType_<typeof WordEvent>
const Tempus = L.Tempus
type Tempus = InstanceType_<typeof L.Tempus>
type N2S = L.Sros.N2S
type Word = L.Word.Word
const $n = L.Sros.Sros.toNumber.bind(L.Sros.Sros)
const last = L.Ut.lastOf
const MemorizeWord = L.MemorizeWord
type MemorizeWord = L.MemorizeWord

const ChangeRecord = L.ChangeRecord
type ChangeRecord = L.ChangeRecord

const Base = L.BaseWeight
type Base = L.BaseWeight
//type Statistics = InstanceType_<typ

//___________________________________________________


/**
 * 默認權參數等
 */
class DefaultOpt{
	static new(){
		const o = new this()
		return o
	}
	/** 加ˡ事件ᵗ權重 */
	addWeight = 0xF
	/** ˣ削弱ᵗ分母 */
	debuffNumerator = 1000*3600*24*90
	base = 20
}

/** 權重ˇ算ᵗ程中ᵗ統計 */
class Statistics{
/* 	static new_deprecated(){
		const o = new this()
		return o
	} */
	static new(finalAddEventPos:integer){
		const o = new this()
		o.__init__(finalAddEventPos)
		return o
	}
	protected __init__(...param:Parameters<typeof Statistics.new>){
		const o = this
		o.finalAddEventPos = param[0]
	}
	weight = s.n(1.1)
	curPos = 0 //當前ʃ処ˋ第幾個事件
	/** 今ᵗ時刻 */
	nunc = Tempus.new()
	/** 加ˡ事件ᵗ數 */
	cnt_add = 0
	cnt_rmb = 0
	/** 憶ᵗ次、若遇加ˡ事件則置零 */
	cnt_validRmb = 0 
	finalAddEventPos = 0
	records:ChangeRecord[] = []
}



class WordWeight extends Base implements I_WordWeight{

	protected constructor(){
		super()
	}

	static new(prop?:{}){
		const o = new this()
		return o
	}

	readonly This = WordWeight

	protected _word__changeRecord:Map<Word, ChangeRecord[]> = new Map()
	get word__changeRecord(){return this._word__changeRecord}

	protected _changeRecord:L.ChangeRecord[] = []
	get changeRecord(){return this._changeRecord}
	set changeRecord(v){this._changeRecord = v}

	protected _paramOpt = this.This.defaultOpt
	get paramOpt(){return this._paramOpt}
	set paramOpt(v){
		//this._paramOpt = v
	}

	addChangeRecord(word:Word, changeRecord:ChangeRecord){
		const z = this
		ChangeRecord.push(z.word__changeRecord, word, changeRecord)
		// let dʼʹ = 1
		// let ˊ = 3
		
		// let ˮ = 4
		// let ʼʽ·ˆˇˈˉˊˋːˤˌ
		// let 

	}

	static get Statistics(){
		return Statistics
	}

	static readonly defaultOpt = DefaultOpt.new()

	static get Handle3Events(){
		/** 處理單個單詞ᵗ單個Tempus_Event實例 */
		class Handle3Events{
			static new(prop:{
				_ww:WordWeight
				,_tempus__event:Tempus_Event
				,_statistics:Statistics
				,_mw:MemorizeWord
			}){
				const o = new this()
				o.__init__(prop)
				return o
			}

			protected __init__(...prop:Parameters<typeof Handle3Events.new>){
				const o = this
				Object.assign(o, ...prop)
				return o
			}

			readonly This = Handle3Events
			_mw:MemorizeWord
			_ww:WordWeight
			_statistics:Statistics
			_tempus__event:Tempus_Event
			static defaultOpt = WordWeight.defaultOpt

			addRecord(record:ChangeRecord){
				const z = this
				// z._ww.addChangeRecord(z._mw.word,record)
				z._statistics.records.push(record)
			}

			handleAll(){
				
			}

			handle(){
				const z = this
				const WE = WordEvent
				switch (z._tempus__event.event){
					case WE.ADD:
						return z.handle_add()
					break;
					case WE.RMB:
						return z.handle_rmb()
					break;
					case WE.FGT:
						return z.handle_fgt()
					break;
					default:
						throw new Error(`unexpected default in switch-case`)
				}
			}
			
			handle_add(){
				const z = this
				const st = z._statistics
				st.cnt_add++ //加ˡ事件ᵗ計數ˇ加一
				st.cnt_validRmb = 0 //有效ᵗ憶ˡ事件ˋ逢加事件則置0
				st.weight = s.m(
					st.weight, z.This.defaultOpt.addWeight
				) // *= 默認加ˡ權重
				//錄ᵣ此輪迭代ʸ權重ᵗ變
				const rec = ChangeRecord.new1(
					z._tempus__event
					, st.weight
				)
				z.addRecord(rec)
				return st
			}

			handle_rmb(){
				const z = this
				const st = z._statistics
				st.cnt_rmb++
				st.cnt_validRmb++
				let weight_ = s.n(1.1)
				const lastRec = last(z._statistics.records)
				if(lastRec == void 0){
					throw new Error('last changeRecord is undef')
				}else if(WordEvent.ADD === lastRec.event){ //若上個事件潙 添
					st.weight = $n( s.d(st.weight, 1.1) ) //自除以1.1
				}else{
					weight_ = z._ww.getTimeWeightOfEvent(lastRec.tempus, z._tempus__event.tempus)
					weight_ = s.d(
						weight_, z._mw.word.times_add
					)
					if(s.c(weight_, 0)<=1){
						weight_ = s.n(1.01)
					}
				}
				const rec = ChangeRecord.new1(z._tempus__event, st.weight)
				if(st.curPos >= st.finalAddEventPos && last(z._mw.date__event).event === WordEvent.RMB ){
					let nowDiffThen = Tempus.diff_mills(st.nunc, z._tempus__event.tempus)
					let debuff = z._ww.getDebuff(
						s.m(
							nowDiffThen
							, sros.pow(
								s.a(z.This.defaultOpt.base, z._mw.word.times_add)
								,st.cnt_add
							)
						),
						s.m(
							z.This.defaultOpt.debuffNumerator
							,st.cnt_rmb
							,weight_
						),
						weight_
					)
					st.weight = $n( s.d(st.weight, debuff) )
					rec.debuff = debuff
					rec.after = st.weight
				}
				z.addRecord(rec)
				return st
			}

			handle_fgt(){
				const z = this
				const lastRec = last(z._statistics.records)
				let weight = z._ww.getTimeWeightOfEvent(lastRec.tempus, z._tempus__event.tempus)
				const st = z._statistics
				if(st.cnt_add >= 3){
					weight = s.m(
						weight
						,st.cnt_add
					)
				}
				if( s.c(weight, 1.5) < 0 ){
					weight = s.n(1.5)
				}
				st.weight = s.m( st.weight, weight )
				const rec = ChangeRecord.new1(z._tempus__event, st.weight)
				z.addRecord(rec)
				//console.log(st.weight)//t
				//process.stdout.write(st.weight+' ')//t
				return st
			}
		}
		return Handle3Events
	}

	async run(mWords:MemorizeWord[]) {
		const z = this
		for(let i = 0; i < mWords.length; i++){
			const uWord = mWords[i]
			z.calc0(uWord)
			//uWord.weight = 114514 //t
		}
		mWords.sort((b,a)=>s.c(a.weight, b.weight))
		return mWords
	}

	calc0(mWord:MemorizeWord){
		const z = this
		const finalAddEventPos = z.This.finalAddEventPos(mWord.date__event)
		const st = z.This.Statistics.new(finalAddEventPos)
		const Handle3Events = z.This.Handle3Events
		const h3 = Handle3Events.new({
			_ww: z
			,_tempus__event: mWord.date__event[0]
			,_statistics: st
			,_mw: mWord
		})
		for(const tempus__event of mWord.date__event){
			h3._tempus__event = tempus__event
			h3.handle()
		}
		mWord.weight = h3._statistics.weight
		//console.log(h3._statistics.records)//t
	}

	/**
	 * 尋ᵣ末個 加ˡ事件
	 * @param tempus__event 
	 * @returns 
	 */
	static finalAddEventPos(tempus__event:Tempus_Event[]){
		let ans = 0
		for(let i = tempus__event.length-1; i>=0; i--){
			if(tempus__event[i].event === WordEvent.ADD){
				ans = i;
				break
			}
		}
		return ans
	}

	/**
	 * 算 事件ᵗ權重
	 * @param lastEventTempus 上個事件
	 * @param curEventTempus 當前事件
	 * @returns 
	 */
	getTimeWeightOfEvent(lastEventTempus:Tempus, curEventTempus:Tempus){
		const z = this
		let timeDiff = Tempus.diff_mills(curEventTempus, lastEventTempus)
		if(timeDiff <=0){throw new Error(`timeDiff <=0`)}
		return z.getTimeWeightByMillS(
			$n( s.d(timeDiff,1000) )
		)
	}

	/**
	 * 由時間跨度(毫秒)算時間ᵗ權重
	 * @param dateDif 
	 * @returns 
	 */
	getTimeWeightByMillS(dateDif:N2S){
		let ans = s.n(dateDif)
		ans = sros.pow(ans, 1/4) //1/2
		ans = s.d(ans, 1) //100
		if( s.c(ans,1) < 0 ){
			ans = s.n(1.01)
		}
		return $n(ans)
	}

	/**
	 * 憶ˡ事件 ᵗ 額外ᵗ效
	 */
	getDebuff(mills:number, numerator:number, weight=s.n(1)){
		let debuff = s.d(
			numerator
			,mills.sub(1000*60*360) // 100 min
		).add(1)  .mul(weight)
		debuff = sros.absolute(debuff)
		return $n(debuff)
	}
}

//throw new Error()
//@ts-ignore
return WordWeight.new()