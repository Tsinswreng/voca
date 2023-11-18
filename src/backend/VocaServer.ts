//import express from 'express'
/*TODO:{
  日誌模塊
  數據庫中null作0
}*/

//require('tsconfig-paths/register');
require('module-alias/register');
import VocaSqlite from "./VocaSqlite";
//const cors = require('cors')
//const express = require('express')
import express, { raw, Request, Response } from 'express'
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import path from "path";
import Tempus from "@shared/Tempus";
import SingleWord2 from "@shared/SingleWord2";
import { IVocaRow } from "@shared/SingleWord2";
import { $, delay, fileToBase64, measurePromiseTime } from "@shared/Ut";
import { VocaRawConfig } from "@shared/VocaRaw2";
import session from 'express-session'
import RandomImg from "./Img";
import Config from "@shared/Config";
import Sqlite from "@shared/db/Sqlite";

Error.stackTraceLimit = 99
const config = Config.getInstance()
//const bodyParser = require('body-parser')
//import * as bodyParser from 'bodyParser'

//const rootDir:string = require('app-root-path').path
const rootDir = process.cwd()
const tempUserName = '114'
const tempPassword = '514'
const oneDaySec = 3600*24

const dirs:string[] = []
//dirs.push(`C:\\Users\\lenovo\\Pictures\\屏保\\nizigenBito`)
//dirs.push(`D:\\_\\視聽\\圖`)
dirs.push(...(config.config.randomImgDir??[]))
//dirs.push(`C:\\Users\\lenovo\\Pictures\\屏保\\scene\\银河系.png`)
//dirs.push(`C:\\Users\\lenovo\\Pictures\\屏保\\scene`)
// dirs.push(`D:\\_\\視聽\\圖\\bili`)
// dirs.push(`D:\\_\\視聽\\圖\\qqero`)
// dirs.push(`D:\\_\\視聽\\圖\\貼吧ᙆᵗ圖`)


//<{}, any, any, QueryString.ParsedQs, Record<string, any>>
// type a = Express.Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>
// interface Req extends Express.Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>{
// 	session?:string
// }

interface MyReq extends Request{
	session?:string
}


//console.log(path.dirname(path.dirname(__dirname)))輸出項目根文件夾
/*const eng = new VocaRaw();
eng.dbName = 'voca'
eng.tableName = 'eng'
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'*/

//let vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語

export default class VocaServer{
	//static vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語
	public static readonly app = express();
	public static sqlt = VocaSqlite.new({})
	public static sqltDbObj = VocaServer.sqlt.db
	public static session
	
	//static pagePath:string = path.resolve(process.cwd())+'/frontend/src/browser'

	public static async main(){
		// console.log(114514)//t
		// await Sqlite.prepare(VocaServer.sqltDbObj, 's')
		// console.log(514114)
		let ri :RandomImg|undefined = undefined
		try{
			ri = await RandomImg.konstructor(dirs)
		}catch(e){
			console.error(`尋不見路徑`)
		}
		
		VocaServer.app.use((req:any, res:any, next:any)=>{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "*");
			res.header("Access-Control-Allow-Headers", "*");
			next()
		})
		//VocaServer.app.use(express.static('browser'));
		//VocaServer.app.use(express.static(Ut.pathAt(rootDir+'/src/frontend/dist')));
		//console.log(path.resolve('./out/frontend/dist'))
		VocaServer.app.use(express.static('./out/frontend/dist'));
		//VocaServer.app.use(express.static('frontend\\src\\browser'))
		
		VocaServer.app.use(express.json({limit: '65536mb'}))
		VocaServer.app.use(express.urlencoded({limit: '65536mb', extended:true}))
		VocaServer.app.use(bodyParser.json({limit:'64MB'}))
		//VocaServer.app.use(express.bodyParser({limit: '50mb'}));
		VocaServer.app.use(bodyParser.json());//??{}??
		VocaServer.app.use(session({
			secret: 'hocEstMeusSecretusKeyus114514810893shitJeanPinkGetDown',
			cookie: {maxAge: oneDaySec},
			saveUninitialized:true,
			resave: false
		}))
		VocaServer.app.use(cookieParser())
		//VocaServer.app.use(cors)
		
		//eng.addSingleWordsToDb()
	


		// VocaServer.app.get('/eng', (req, res)=>{ //待改:此處ᵗ「/eng」ˋ還昰ᵣ寫死ₐ。
		// 	const db = VocaServer.vocaObjs[0].getDbConnection()
		// 	db.query(`SELECT * FROM ${VocaServer.vocaObjs[0].tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
		// 		//console.log('results:'+results)//RowDataPacket
		// 		res.setHeader('content-type','text/html;charset=utf-8')
		// 		res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
		// 		//console.log(results['600']['wordShape'])
		// 		//return results//蜮不效
		// 	})
		// })
		
		// VocaServer.app.get('/jap', (req:any, res:any)=>{
		// 	let path = req.path
		// 	console.log('path:'+path)//t
		// 	const db = VocaServer.vocaObjs[1].getDbConnection()
		// 	db.query(`SELECT * FROM ${VocaServer.vocaObjs[1].tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
				
		// 		//console.log('results:'+results)//RowDataPacket
		// 		res.setHeader('content-type','text/html;charset=utf-8')
		// 		res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
		// 		//console.log(results['600']['wordShape'])
		// 		//return results//蜮不效
		// 	})
		// })
		this.app.get('/english', async (req,res)=>{
			
			let path = req.path
			console.log('path:'+path)//t
			let eng = VocaSqlite.new({_tableName:'english'})
			let words = await eng.getAllWords()
			//console.log(words)
			//console.log(JSON.stringify(words))
			res.setHeader('content-type','text/html;charset=utf-8')
			res.end(JSON.stringify(words))
			
		})
		
		this.app.get('/japanese', async (req,res)=>{
			let path = req.path
			console.log('path:'+path)//t
			let sqlt = VocaSqlite.new({_tableName:'japanese'})
			let words = await sqlt.getAllWords()
			res.setHeader('content-type','text/html;charset=utf-8')
			res.end(JSON.stringify(words))
		})

/* 		VocaServer.app.get('/', (req:any, res:any)=>{
			console.log(req.ip)
			let path = req.path
			console.log('path:'+path)
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile('/index.html')
		}) */


		// VocaServer.app.post('/post', (req, res)=>{
		// 	console.log(req.body)
		// 	VocaRaw.updateDb(req.body)
		// 	//VocaRaw.updateDb(JSON.parse(req.body))
		// 	const timeNow = Tempus.new().iso
		// 	res.send('成功接收到数据'+timeNow)
		// })

		VocaServer.app.post('/saveWords',(req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//console.log(req.body)
			//let rows:IVocaRow[] = JSON.parse(req.body)
			let sws:SingleWord2[] = SingleWord2.parse(req.body as IVocaRow[])
			VocaSqlite.saveWords(this.sqltDbObj, sws)
			res.send('receive successfully'+nunc.iso)
		})

		VocaServer.app.post('/addWords',async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//console.log(req.body)
			//let rows:IVocaRow[] = JSON.parse(req.body)
			//let sws:SingleWord2[] = SingleWord2.parse(req.body)
			//const [rows, config] = req.body
			try{
				const rows:IVocaRow[] = $(req.body[0])
				const config2:VocaRawConfig = $(req.body[1])
				const sws = SingleWord2.parse(rows)
				//console.log(sws[0])//t
				//await VocaSqlite.backupTableInDb(VocaServer.sqltDbObj, sws[0].table) //每加詞則備份表
				//const vsqlt = VocaSqlite.new({_tableName: sws[0].table})
				//console.log(1)//t
				const backupDb = VocaSqlite.new({
						_dbPath:config.config.backupDbPath
						, mode:Sqlite.openMode.DEFAULT_CREATE
				})
				//console.log(2)//t
				await VocaSqlite.backupTable(VocaServer.sqltDbObj, sws[0].table, backupDb.db) //* 無調用堆棧
				//throw new Error('mis')
				//const stmt = await Sqlite.prepare(backupDb.db, `SELECT * FROM 'a'`) 
				//await Sqlite.stmtRun(stmt) //t 能輸出調用堆棧
				//console.log(3)//t *
				const [init, modified] = await VocaSqlite.addWordsOfSameTable(VocaServer.sqltDbObj, sws)
				 //<待改>{config.dbPath等ˇ皆未用、實則猶存于 VocaServer.sqltDbObj處。}
				console.log(init)
				console.log(modified)//t
				const addedWords_init:string[] = await VocaSqlite.getWordShapesByIds(VocaServer.sqlt.db, sws[0].table, init)
				const addedWords_modified:string[] = await VocaSqlite.getWordShapesByIds(VocaServer.sqlt.db, sws[0].table, modified)
				const addedWords = [...addedWords_init,...addedWords_modified]
				res.send(addedWords+'\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.log(`console.error(e)`)//t
				console.error(e)
				res.send('add failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post('/backupAll',async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				await this.sqlt.backAllTables()
				res.send('backup successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('backup failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post('/backup',async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				const tableName:string = $((req.body).tableName)
				//await this.sqlt.creatTable(tableName, false)
				//res.send('creat table successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('creat table failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post('/creatTable',async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				const tableName:string = $((req.body).tableName)
				await this.sqlt.creatTable(tableName, false)
				res.send('creat table successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('creat table failed\n'+Tempus.format(nunc)) //t
			}
		})

		// VocaServer.app.get('/login',async (req:MyReq,res)=>{
		// 	const nunc = Tempus.new()
		// 	console.log(req.path+' '+Tempus.format(nunc))
		// 	res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
		// })


		VocaServer.app.post('/user/login',async (req:MyReq,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			console.log(req.body)
			console.log(req.body.username)
			console.log(req.body.password)
			if(req.body.username === tempUserName && req.body.password === tempPassword){
				VocaServer.session = req.session
				VocaServer.session.userid = req.body.username
				res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
			}else{
				res.send('Invalid username or password');
			}
		})

		VocaServer.app.post('/randomImg', async (req,res)=>{
			if(!ri){return}
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//res.sendFile(ri.oneRandomFile())
			const path = ri.oneRandomFile()
			const [time, base64] = await measurePromiseTime(fileToBase64(path))
			console.log(`fileToBase64 耗時: `+time)
			const pair:[string, string] = [path, base64]
			//res.send(JSON.stringify(pair))
			res.json(pair)
		})

		VocaServer.app.get('*', (req:MyReq, res)=>{
			VocaServer.session=req.session??''
			if(VocaServer.session.userid && req.path==='/login'){
				console.log(114514)//t
				res.setHeader('content-type','text;charset=utf-8')
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
			}else{
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
				//res.redirect('/login')
				//console.log(`res.redirect('/login')`)//t
			}
		})
					//res.send(`<h1>404</h1>`)
			//res.sendFile('./out/frontend/dist') 叵、只能用絕對路徑
			//res.sendFile('D:/_/mmf/PROGRAM/_Cak/voca/src/frontend/dist/index.html')
			//res.send('<h1>1919</h1>')
		
		/* VocaServer.app.get('/login', (req:any, res:any)=>{
			console.log(req.body)
			if(req.body.tempPwd === '一'){
				console.log('密碼正確')
			}else{
				console.log('密碼錯誤')
			}
		}) */
		
		VocaServer.app.listen(config.config.port, ()=>{
			console.log(`at\nhttp://127.0.0.1:${config.config.port}`)
		})
	}
	
}
