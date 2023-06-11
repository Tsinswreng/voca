interface Ui{

}

//[23.06.11-1205,]
class OriginUi implements Ui{
	private _vocaBObj:VocaB
	get vocaBObj(){
		return this._vocaBObj
	}
	set vocaBObj(v:VocaB){
		this._vocaBObj = v;
	}
	constructor(vocaBObj:VocaB){
		this._vocaBObj = vocaBObj
		//this.vocaBObj = vocaBObj
	}


	//[23.06.11-1058,]
	public startToShow(vocaBObj:VocaB = this.vocaBObj):void{
		//console.log(this.vocaBObj)//t
		//vocaBObj = this.vocaBObj;
		vocaBObj.startToShow(vocaBObj.wordsToLearn)
		$('#'+vocaBObj.wordAreaId).text(vocaBObj.curSingleWord.wordShape)
		this.showCurWordInfoRight(vocaBObj)
	}
	
	/**
	 * 
	 * @param eventFn 憶 或 忘 ˉ函數
	 * 調用旹勿忘bind(this)
	 */
	public showNext(eventFn:(vocaBObj:VocaB)=>{}){
		eventFn(this.vocaBObj);
		
		$('#'+this.vocaBObj.lastWordInfoDivId).text(this.vocaBObj.curSingleWord.wordShape+
			"\n"+VocaB.取逆轉義ᵗstr(VocaB.取字符串數組中長度最大者(this.vocaBObj.curSingleWord.fullComments)));//TODO:示釋義數組旹每元素間增空行
		
		$('#last_wordShape').text(this.vocaBObj.curSingleWord.wordShape)
		$('#last_wordId').text(this.vocaBObj.curSingleWord.id)
		$('#last_ling').text(this.vocaBObj.curSingleWord.ling)
		$('#last_wordEvent').text(this.vocaBObj.curSingleWord.取ᵣ可視化事件('●','■','□') as string) //此步蜮甚耗時ⁿ致塞
		$('#last_priority').text(this.vocaBObj.curSingleWord.priority)
		$('#last_addedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this.vocaBObj.curSingleWord.addedDates)))
		$('#last_addedTimes').text(this.vocaBObj.curSingleWord.addedTimes)
		$('#last_rememberedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this.vocaBObj.curSingleWord.rmbDates)))
		$('#last_rememberedTimes').text(this.vocaBObj.curSingleWord.rmbTimes)
		$('#last_forgottenDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this.vocaBObj.curSingleWord.fgtDates)))
		$('#last_forgottenTimes').text(this.vocaBObj.curSingleWord.fgtTimes)
		$('#score').text(this.vocaBObj.idsOfCurRemWords.length+':'+this.vocaBObj.idsOfCurFgtWords.length)
		this.vocaBObj.showNext(this.vocaBObj)
		$('#'+this.vocaBObj.wordAreaId).text(this.vocaBObj.curSingleWord.wordShape);
		this.showCurWordInfoRight(this.vocaBObj)
	}

	public showWordInfoAtBottom(){
		console.dir(this.vocaBObj.curSingleWord)
		console.dir(this.vocaBObj.curSingleWord.priorityObj)
		console.dir(this.vocaBObj.curSingleWord.priorityObj.procedure)
		$('#'+this.vocaBObj.lastWordInfoDivId).text(this.vocaBObj.curSingleWord.wordShape+
			"\n"+VocaB.取逆轉義ᵗstr(VocaB.取字符串數組中長度最大者(this.vocaBObj.curSingleWord.fullComments) ));
	
	}

	public showCurWordInfoRight(vocaBObj:VocaB = this.vocaBObj){
		$('#wordShape').text(vocaBObj.curSingleWord.wordShape)
		$('#wordId').text(vocaBObj.curSingleWord.id)
		$('#ling').text(vocaBObj.curSingleWord.ling)
		$('#wordEvent').text(vocaBObj.curSingleWord.取ᵣ可視化事件('●','■','□') as string)
		$('#priority').text(vocaBObj.curSingleWord.priority)
		$('#addedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(vocaBObj.curSingleWord.addedDates)))
		$('#addedTimes').text(vocaBObj.curSingleWord.addedTimes)
		$('#rememberedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(vocaBObj.curSingleWord.rmbDates)))
		$('#rememberedTimes').text(vocaBObj.curSingleWord.rmbTimes)
		$('#forgottenDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(vocaBObj.curSingleWord.fgtDates)))
		$('#forgottenTimes').text(vocaBObj.curSingleWord.fgtTimes)
	}

	public reviewForgottenWords(){
		this.vocaBObj.reviewForgottenWords()
		this.startToShow()

	}

}

