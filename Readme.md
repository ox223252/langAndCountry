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