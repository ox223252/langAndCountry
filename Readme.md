# lang & country selector

## Exemple:

```html
<table>
	<tr>
		<td>
			<span id="country_1"></span>
		</td>
		<td>
			<span id="lang_1"></span>
		</td>
	</tr>
	<tr>
		<td>
			<div class="country_fr">France</div>
			<div class="country_gb">Great Britain</div>
			<div class="country_es">España</div>
			<div class="country_ck">Cook Islands</div>
		</td>
		<td>
			<div class="lang_fr">Bonjour en Français</div>
			<div class="lang_en">Hello in English</div>
			<div class="lang_es">Hola en Español</div>
			<div class="lang_ar">مرحبا بالعربية</div>
			<div class="lang_ru">привет по русски</div>
			<div class="lang_ch">中文你好</div>
		</td>
	</tr>
</table>
```

```js
let c = new CountrySelector ( {
	target:document.getElementById("countryBox"),
	list:["fr","gb","es", "ck"],
	current:"ck",
	name:"country",
	type:"popup"
} );

let l = new LangSelector ( {
	target:document.getElementById("langBox"),
	list:["fr","es","en","ar","ru","ch"],
	current:"ar",
	name:"lang",
	type:"popup",
	style:{"backgroundColor":"grey"}
})
```

## source:
Flags are provided by : [drapeauxdespays](https://www.drapeauxdespays.fr/telecharger/vectorielles) fully free even for comercial use :)

# lang and translations

```html
<span id="lang_1"></span>

<div class="translate" data-translate='{"textId":"id_text1","prefix":"lang"}'></div>
```
```js
let trad = {
	fr:{id_text1:"Bonjour en Français"},
	en:{id_text1:"Hello in English"},
	es:{id_text1:"Hola en Español"},
	ar:{id_text1:"مرحبا بالعربية"},
	ch:{id_text1:"中文你好"},
	ru:{id_text1:"привет по русски"}
}

let t = new Translate ( "translate", trad );

let l = new LangSelector ( {
	target:document.getElementById("lang_1"),
	list:["fr","es","en","ar","ru","ch"],
	current:"ar",
	name:"lang",
	type:"popup",
	style:{"backgroundColor":"grey"},
	logo:{
		display: true,
		style:{
			maxWidth: "1em",
			maxHeight: "1em",
			fill: "black",
			stroke: "black",
			strokeWidth: "1",
			marginRight: "10px"
		}
	}
})
```

`lang_1` will be the language selector and it will manage all text with className prefixed by `lang_` like `lang_en`, `mlan_es` ...

for our translated text we will define the class name use to select all text who need translation, for each text add `data-translate` with `textId` and `prefix` in JSON format, if only one prefix used in the file it can be removed from `data-translate` and passed to contructor main options:

```html
<div class="translate" data-translate='{"textId":"id_text1"}'></div>
<div class="translate" data-translate='{"textId":"id_text2"}'></div>
```
```js
let t = new Translate ( "translate", trad, {prefix:"lang"} );
```

## translation dataBase

its a big object with each lang and for each lang the text ID.

```js
{
	en:
	{
		id_text1:"Hello in English"
	}
}
```
```js
{
	en:
	{
		id_text1:
		{
			t: "Hello in English",
			domEl: "span",
			options:
			{
				style: "background-color:red"
			}
		}
	}
}
```

## select

```html
<select class="translate" data-translate='{"textId":"id_text2","prefix":"lang","default":"2"}'></select>

<div class="translate" data-translate='{"textId":"id_text2","prefix":"lang"}'></div>
```
```js
{
	fr:{
		id_text1:"Bonjour en Français",
		id_text2:
		[
			{t:"fr_A",v:1},
			{t:"fr_B",v:2},
			{t:"fr_C",v:3}
		]
	},
	en:{id_text1:"Hello in English",
		id_text2:
		[
			{t:"en_A",v:1},
			{t:"en_B",v:2},
			{t:"en_C",v:3}
		]
	}
}
```