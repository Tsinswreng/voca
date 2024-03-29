# wiki
2023-09-23T23:36:55.000+08:00
待完成

## 單詞表之格式

### 快速開始

1. 首先新建一個文本文件、然後在文件頭部寫上一對config標籤。然後在裏面寫一對大括號。這是單詞表的配置。

```
<config>
{

}
</config>
```

請注意、`<config>`之前不能再有任何內容。否則會解析失敗。

2. 聲明表名。這將決定該單詞表中的單詞被加進哪個表格。比如我的數據庫中有一個表格叫`myTable`、我希望這些單詞被加進`myTable`表裏、則如是寫

```
<config>
{
	dbName: 'myTable',
}
</config>
```

表格不存在會報錯。您可以先在前端頁面輸入表名直接創建一張單詞表。

3. 寫一個日期加一對大括號。是謂「日期塊」

```
<config>
{
	dbName: 'english',
}
</config>

2023-09-24T19:20:32.000+08:00
{

}

```

日期格式默認使用形如`2023-09-24T19:20:32.000+08:00`的格式。即`年年年年-月月-日日T時時:分分:秒秒.毫毫毫` 加上時區。
此日期格式是ISO8601標準的格式、也便于日期庫解析。而且作者本人的輸入法可以直接生成此格式的日期、輸入也不麻煩、所以選用此格式。
日期格式可以改。修改方法見後文。

4 .在日期塊中添加單詞。比如我在瀏覽網頁時遇到了test這個單詞、我不認識這個單詞、那麼通過劃詞翻譯軟件快捷査到詞義後直接複製粘貼到日期塊裏。

```
<config>
{
	dbName: 'english',
}
</config>

2023-09-24T19:20:32.000+08:00
{

test
US: [test] 
UK: [test] 
v.	试验；测试；检测；测验
n.	试验；检测；考试；测验
Web	检验；考验；睾酮(testosterone)

}

```

然後 按readme中的方法部署之後、訪問首頁。主頁中左上角的`+`標誌即菜單。在`Manage`中可以添加單詞和創建表格。

在Manage中創建表格`myTable`、然後把上面的樣例複製到文本域中、點擊添加。


以下是更詳細的樣例的解釋。

```
<config>	--用戶自定義配置開始。裏面應當寫一個符合VocaRawConfig接口的js對象。 <config>之前不能再有任何內容。
{
	tableName: 'english',
}
</config>	--用戶自定義配置結束

2023-09-22T12:40:26.123+08:00	--日期。一個日期塊中的所有的單詞的添加日期都以此爲準。
{	-- 日期塊起始、默認用左大括號。日期塊以內不得再出現大括號、否則無法解析單詞。(技術有限)。一個日期塊中可以放任意多個單詞塊。

-- 以下是無空行單詞塊

test	-- 第一行會被視作詞形
美: [test]	-- 後面的部分都會被視作詞義
英: [test] 
<<這是用戶批註>>	-- 這是用戶批註。 默認用<<>>括起來。 可有可無。
v.	试验；测试；检测；测验
n.	试验；检测；考试；测验
网络	检验；考验；睾酮(testosterone)

word	--不允許像這樣的孤零零的一行。因爲無空行詞塊的第一行會被看作詞形、後面的部分都會被視作詞義、當沒有詞義時會報錯。

-- 以下是有空行單詞塊。
[[	-- 單詞塊起始標記。默認用雙左中括號
try

美: [traɪ] 

英: [traɪ] 

n.	尝试；试图；努力；在对方球门线后带球触地

v.	试图；想要；设法；努力
网络	试验；试一试；试穿
]]	-- 單詞塊結束標記。默認用雙右中括號

}	-- 日期塊結束

-- 以下是又一個日期塊。

2023-09-23T23:20:43.456+08:00
{
experiment
美: [ɪkˈsperɪˌment] 
英: [ɪk'sperɪ.ment] 
n.	实验；试验；尝试；实践
v.	尝试；试用；做试验；进行实验
网络	进行试验；微机实验与设计；实验法


}

```

以下可供複製㕥測試。

```
<config>
{
	tableName: 'english',
}
</config>

2023-09-22T12:40:26.123+08:00
{
test
美: [test] 
英: [test] 
v.	试验；测试；检测；测验
n.	试验；检测；考试；测验
网络	检验；考验；睾酮(testosterone)

[[
try

美: [traɪ] 

英: [traɪ] 

n.	尝试；试图；努力；在对方球门线后带球触地

v.	试图；想要；设法；努力
网络	试验；试一试；试穿
]]
}

2023-09-23T23:20:43.456+08:00
{
experiment
美: [ɪkˈsperɪˌment] 
英: [ɪk'sperɪ.ment] 
n.	实验；试验；尝试；实践
v.	尝试；试用；做试验；进行实验
网络	进行试验；微机实验与设计；实验法
}

```



* `<config>`到`</config>`之間的部分爲單詞表的配置。可配置內容如下:

``` ts
//這是配置的ts接口
export interface VocaRawConfig{
	dbName:string, //數據庫的名稱、暫未啓用
	dbPath:string, //數據庫的路徑、暫未啓用
	tableName:string, // 表名、必填、即使不填使用默認值(空字串)也會報錯
	dateFormat:string, //日期格式 
	dateRegex:string, //用來匹配日期的正則表達式、不準有捕獲組
	dateBlock: [string, string], // 日期塊起始和結束的字符標記
	wordBlock: [string, string], // 有多行單詞塊起始和結束的字符標記
	annotation: [string, string], // 用戶批註(不是註釋)的起始和結束的字符標記
}

//這是默認配置。默認配置會與用戶自定義配置合併、默認配置優先級最低。
export const config:VocaRawConfig = {
	dbName:"voca",
	dbPath:"",
	tableName: '',
	dateFormat:'YYYY-MM-DDTHH:mm:ss.SSSZ',
	dateRegex: (/\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|\+\d{2}:\d{2})/g).source,
	dateBlock: ['\\{','\\}'],
	wordBlock: ['\\[{2}','\\]{2}'],
	annotation: ['<<','>>'],
}

```
