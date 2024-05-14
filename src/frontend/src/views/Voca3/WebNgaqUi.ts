import { RMB_FGT } from "@shared/entities/Word/SvcWord"
import { NgaqSvc } from "@shared/logic/memorizeWord/NgaqSvc"
import { WordEvent } from "@shared/SingleWord2"
import { WebSvcWord } from "@ts/voca3/entities/WebSvcWord"
import { WebNgaqSvc } from "@ts/voca3/WebNgaqSvc"
import { ref, Ref } from "vue"
import lodash from 'lodash'
import { $ } from "@shared/Ut"
import { Exception } from "@shared/Exception"


// function testU8ArrToBase64(uint8Array:Uint8Array){
// // 假设您有一个名为 uint8Array 的 UInt8Array 对象

// // 将 UInt8Array 对象转换为普通数组
// const array = Array.from(uint8Array);
// //const array = uint8Array

// // 将数组中的每个元素转换为字符
// const chars = array.map(byte => String.fromCharCode(byte));

// // 将字符数组连接为字符串
// const binaryString = chars.join('');

// // 使用 btoa() 将二进制字符串转换为 base64 编码
// const base64String = btoa(binaryString);
// return base64String
// }

class HtmlClass{
	class_bg = ref('bg')
	class_bg_next = ref('bg_next')
}

class HtmlId{
	id_bg = ref('bg')
	id_bg_next = ref('bg_next')
}

class UiStuff{
	isSaved = false
	//isShowWordInfo = false
	isShowWordInfo = ref(false)
	isShowCardBox = ref(false)
	pageNums = 1
	debuffNumerator_str:string = ''
	isShowRandomBg:Ref<Boolean> = ref(false)
	multiMode_key:Ref<number> = ref(0)
	//reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')
}

const withTryCatchProxy = (target: WebNgaqUi) => {
	return new Proxy(target, {
		get(target, prop) {
			if (typeof target[prop] === 'function') {
				return function (this:WebNgaqUi, ...args) {
					try {
						const ans = target[prop].apply(this, args)
						if(ans instanceof Promise){
							ans.catch(e=>{
								target.handleErr(e)
							})
						}
					} catch (error) {
//						console.error(`Error in method ${String(prop)}:`, error);
						target.handleErr(error)
					}
				};
			} else {
				return target[prop];
			}
		},
	});
};


export class WebNgaqUi{
	protected constructor(){

	}

	protected static _instance:WebNgaqUi

	static async getInstanceAsync(){
		const z = this
		if(z._instance == void 0){
			z._instance = await z.New()
		}
		return this._instance
	}

	protected static async New(){
		const z = new this()
		await z.__Init__()
		const proxy = withTryCatchProxy(z)
		//console.log(proxy instanceof Proxy) 報錯
		//console.log(proxy instanceof WebNgaqUi) true
		return proxy
		//return z
	}

	protected async __Init__(){
		const z = this
		z._svc = await WebNgaqSvc.New()
		z.registerToWindow()
		return z
	}

	protected _svc:WebNgaqSvc
	get svc(){return this._svc}

	protected _curWord:WebSvcWord|undefined
	get curWord(){return this._curWord}
	set curWord(v){this._curWord = v}

	get wordsToLearn(){return this._svc.wordsToLearn}

	protected _uiStuff = new UiStuff()
	get uiStuff(){return this._uiStuff}
	//set uiStatus(v){this.}

	protected _htmlClass = new HtmlClass()
	get htmlClass(){return this._htmlClass}

	protected _htmlId = new HtmlId()
	get htmlId(){return this._htmlId}

	registerToWindow(){
		const z = this
		//@ts-ignore
		window['_'] = z
	}

	/** @deprecated */
	registerToWindow0(){
		const z = this
		//@ts-ignore
		window._voca = {}
		//@ts-ignore
		const ui = window._voca
		const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(z))
		//console.log(keys)
		for(const k of keys){
			if(k === 'registerToWindow' || k === 'constructor'){
				continue
			}
			//console.log(k, typeof z[k])
			if(typeof z[k] === 'function'){
				ui[k] = z[k].bind(z)
			}else{
				ui[k] = z[k]
			}
		}
	}

	handleErr(err:any){
		if(err instanceof Error){
			if(err instanceof Exception){
				console.error(err)
				alert(err.reason.name)
			}
		}
	}
	
	async start(){
		const z = this
		await z.svc.start()
		z.fresh_wordBox()
	}

	learnByIndex(index:int, event:RMB_FGT){
		const z = this
		return z.svc.learnByIndex(index, event)
	}

	/** @deprecated */
	learnByWord(mw:WebSvcWord, event:RMB_FGT){
		const z = this
		z._curWord = mw
		z.fresh_wordInfo()
		const ans = z.svc.learnByWord(mw, event)
		if(mw instanceof WebSvcWord){
			switch (event){
				case WordEvent.RMB:
					mw.uiStuff.reciteStatusRef.value = 'rmb'
				break;
				case WordEvent.FGT:
					mw.uiStuff.reciteStatusRef.value = 'fgt'
				break;
			}
		}
		return ans
	}

	learnOrUndoByIndex(index:int, event:RMB_FGT){
		const z = this
		//return z.svc.learnOrUndoByIndex(index, event)
		const mw = $(z.svc.wordsToLearn[index], 'z.svc.wordsToLearn[index]')
		z._curWord = mw
		z.fresh_wordInfo()
		//const ans = z.svc.learnByWord(mw, event)
		const ans = z.svc.learnOrUndoByIndex(index, event)
		if(mw instanceof WebSvcWord){
			switch (ans){
				case WordEvent.RMB:
					mw.uiStuff.reciteStatusRef.value = 'rmb'
				break;
				case WordEvent.FGT:
					mw.uiStuff.reciteStatusRef.value = 'fgt'
				break;
				case void 0:
					mw.uiStuff.reciteStatusRef.value = 'nil'
				break
			}
		}
		return ans
	}

	updateWordInfo(){

	}

	getLearnedWords(){
		const z = this
		return [z.svc.rmbWord__index, z.svc.fgtWord__index]
	}

	undoByWord(mw:WebSvcWord){
		const z = this
		const ans = mw.undo()
		if(mw instanceof WebSvcWord){
			mw.uiStuff.reciteStatusRef.value = 'nil'
		}
		return ans
	}

	getCurrentWord(){
		return this._curWord
	}

	mkWordBox(){
		const z = this
		z.uiStuff.isShowCardBox.value = false
		z.uiStuff.isShowCardBox.value = true
	}

	rmWordBox(){
		const z = this
		z.uiStuff.isShowCardBox.value = true
		z.uiStuff.isShowCardBox.value = false
	}

	fresh_wordBox(){
		const z = this
		z.rmWordBox()
		z.mkWordBox()
	}

	fresh_wordInfo(){
		const z = this
		z.uiStuff.isShowWordInfo.value = false
		z.uiStuff.isShowWordInfo.value = true
	}


	/** 開始按鈕 */
	async prepareEtStart(){
		const z = this
		await z.svc.load()
		await z.svc.sort()
		return z.start()
	}

	async save(){
		const z = this
		return await z.svc.save()
	}

	async restart(){
		const z = this
		z.fresh_wordBox() // 不效
		return z.svc.restart()
	}

	async saveEtRestart(){
		const z = this
		const saveOk = await z.save()
		const restartOk = await z.restart()
	}

	set_page(str:string){}

	test(){
		const z = this
		// console.log(z._svc instanceof VocaSvc)
		// console.log(z.svc.wordsToLearn)
	}

	changeRec(){
		const z = this
		return z.svc.weightAlgo?.word__changeRecord
	}


	//TODO 把changeRecord作潙可選屬性 集于MemorizeWord
	seekChangeRec(index:int){
		const z = this
		const recs = z.svc.weightAlgo?.word__changeRecord
		if(recs == void 0){
			console.log(`recs == void 0`)
			return
		}
		const curWord = z.wordsToLearn[index]
		console.log(curWord)//t
		return recs.get(curWord.word)
	}

	// async d(){
	// 	const z = this
	// 	const blob = new Blob(['123'], {type: 'text'})
	// 	const url = URL.createObjectURL(blob)
	// 	console.log(url)
	// 	for(let i = 0; i < url.length; i++){
	// 		console.log(url[i])
	// 	}
	// }

	// async test_get_imgU8Arr(){
	// 	const z = this
	// 	const got:Response = await z.svc.testImg()
	// 	const json = await got.json()
	// 	console.log(json['text'], 'text')//t
	// 	const buffer = json['blob']
	// 	const data:Uint8Array = buffer.data
	// 	return data
	// }

	// test_getImg(){
	// 	const z = this
	// 	const imgs = document.getElementsByClassName(z.htmlClass.class_bg.value)
	// 	const first = imgs[0] as HTMLImageElement
	// 	if(first == void 0){
	// 		console.error(`first == void 0`)
	// 		return
	// 	}
	// 	return first
	// }

	// async tb(){
	// 	const z = this
	// 	const data = await z.test_get_imgU8Arr()
	// 	const base8964 = testU8ArrToBase64(data)
	// 	const prefix = `data:image/png;base64,`
	// 	const first = $(z.test_getImg())
	// 	first.src = prefix+base8964
	// 	z.t1()
	// }

	// async tu(){
	// 	const z = this
	// 	z.t1()
	// 	const data = await z.test_get_imgU8Arr()
	// 	const imgs = document.getElementsByClassName(z.htmlClass.class_bg.value)
	// 	const first = imgs[0] as HTMLImageElement
	// 	if(first == void 0){
	// 		console.error(`first == void 0`)
	// 		return
	// 	}
	// 	const blob = new Blob(
	// 		[data]
	// 		//,{type: 'image/jpeg'}
	// 	)
		
	// 	first.src = URL.createObjectURL(blob)
	// 	// console.log(blob, 'blob')
	// 	// console.log(buffer.data, 'buffer.data') //是 非空UInt8Array
	// 	console.log(first.src)//t
	// 	z.uiStuff.isShowRandomBg.value = false
	// 	z.uiStuff.isShowRandomBg.value = true
	// 	// // 釋放URL資源
	// 	// URL.revokeObjectURL(imageUrl);
	// }
	// t0(){
	// 	const z = this
	// 	z.uiStuff.isShowRandomBg.value = true
	// 	z.uiStuff.isShowRandomBg.value = false
	// }
	// t1(){
	// 	const z = this
	// 	z.uiStuff.isShowRandomBg.value = false
	// 	z.uiStuff.isShowRandomBg.value = true
	// }
}


class BgImg{
	protected constructor(){}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	protected __init__(){
		const z = this
		return z
	}
	get This(){return BgImg}

	
}