"use strict";

class Selector {
	label = {};
	show = undefined;

	constructor ( params )
	{
		this.params = params;

		if ( ( undefined == this.params.target )
			|| ( null == this.params.target ) )
		{
			this.params.target = document.getElementById( this.params.id );
		}

		if ( undefined == this.params.name )
		{
			this.params.name = this.params.target.id;
		}

		switch ( this.params.type )
		{
			default:
			case "popup":
			{
				let eventMnger = (ev)=>{
					let rect = this.params.target.getBoundingClientRect();
					popup.style.top = rect.bottom+"px"
					popup.style.display = (ev.type=="mouseenter")?"flex":"none";
				};

				let popup = document.createElement ( "div" );
				switch ( this.params?.classList?.constructor.name )
				{
					case "Array":
					{
						this.params.classList.map( c=>popup.classList.add ( c ) );
						break;
					}
					case "String":
					{
						popup.classList.add ( this.params.classList );
						break;
					}
				}
				popup.style.display = "none";
				popup.style.position = "absolute";
				popup.style.flexDirection = "column";
				popup.style.padding = "10px";
				popup.style.border = "solid 1px";
				popup.style.borderRadius = "7px";
				if ( undefined != this.params.style )
				{
					Object.assign ( popup.style, this.params.style );
				}
				
				popup.onmouseenter = eventMnger;
				popup.onmouseleave = eventMnger;

				for ( let item of this.params.list )
				{
					this.label[ item ] = document.createElement ( "label" );
					this.label[ item ].innerHTML = item;
					this.label[ item ].style.width = "100%";
					this.label[ item ].style.textAlign = "left";
					this.label[ item ].setAttribute ( "data-item", item );
					this.label[ item ].onclick = (ev)=>{this.changeEl(ev);};

					popup.appendChild ( this.label[ item ] );
				}

				this._setStyle ( );

				this.show = document.createElement ( "div" );
				this.show.innerHTML = this.params.current;

				this.params.target.appendChild ( this.show );
				this.params.target.appendChild ( popup );
				this.params.target.onmouseenter = eventMnger;
				this.params.target.onmouseleave = eventMnger;

				break;
			}
		}
	}

	_setStyle ( )
	{
		if ( undefined == this.style )
		{
			this.style = document.createElement ( "style" );
			document.head.appendChild ( this.style );
		}

		this.style.innerHTML = "";
		for ( let item of this.params.list )
		{
			let id = this.params.name + '_' + item;

			if ( this.params.current == item )
			{
				continue;
			}

			this.style.innerHTML += '.'+id+'{display:none}'
		}
	}

	changeEl ( ev )
	{
		let target = ev.target;
		let current = undefined;

		do
		{
			current = target.getAttribute ( "data-item" );

			if ( current )
			{
				break;
			}
			target = target.parentNode;
		}
		while ( "body" != target.tagName.toLowerCase() );

		this.params.current = current;

		this._setStyle ( );
		this._updateDsiplay ( );

		this.domEl.dispatchEvent ( new Event ( "change" ) );
	}

	_updateDsiplay ( )
	{
		while ( this.show.firstChild )
		{
			this.show.removeChild ( this.show.lastChild );
		}

		this.show.appendChild ( this.label[ this.params.current ].cloneNode ( true ) );
	}

	_getFileName ( )
	{
		function getErrorObject(){
			try { throw Error('') } catch(err) { return err; }
		}

		let err = getErrorObject();
		let array = err.stack.toString( ).split ( "\n" );
		let fileName = array[0];
		if ( -1 >= array[ 0 ].indexOf ( "getErrorObject" ) )
		{
			fileName = array[ 1 ];
		}

		fileName = fileName.substring ( fileName.search ( /@|\(/ ) + 1 )
		fileName = fileName.substring ( 0, fileName.lastIndexOf ( ":" ) );
		fileName = fileName.substring ( 0, fileName.lastIndexOf ( ":" ) );
		let path = fileName.substring ( 0, fileName.lastIndexOf ( "/" ) + 1 );
		fileName = fileName.substring ( fileName.lastIndexOf ( "/" ) + 1 );

		return {path:path, file:fileName};
	}

	get value ( )
	{
		return this.params.current;
	}

	set value ( lang )
	{
		if ( this.params.list.includes ( lang ) )
		{
			this.params.current = lang;
			this._setStyle ( );
			this._updateDsiplay ( );
		}
	}

	get domEl ( )
	{
		return this.params.target;
	}

	get name ( )
	{
		return this.params.name;
	}
}

class CountrySelector extends Selector {

	constructor ( params )
	{
		super ( params );

		let path = this._getFileName ( ).path;

		for ( let item in this.label )
		{
			let img = document.createElement ( "img" );
			img.src = path + "./flags/"+item+".svg";
			img.alt = item;
			img.height = 27;
			img.width = 45;

			while ( this.label[ item ].firstChild )
			{
				this.label[ item ].removeChild ( this.label[ item ].lastChild );
			}

			this.label[ item ].appendChild ( img );
		}

		this._updateDsiplay ( );
	}
}

class LangSelector extends Selector {
	constructor ( params )
	{
		super ( params );

		let path = this._getFileName ( ).path;

		fetch ( path + "langs.json" )
			.then(r=>r.json())
			.then((d)=>{
				for ( let item in this.label )
				{
					this.label[ item ].innerHTML = d[ item ].name;
					if ( undefined == d[ item ].style )
					{
						continue;
					}
					Object.assign ( this.label[ item ].style, d[ item ].style );
				}
				this._updateDsiplay ( );
			});

		if ( this.params.logo?.display == false )
		{ // don't display trad logo
		}
		else fetch ( path+"lang.svg" )
			.then(r=>r.text())
			.then(t=>{
				this.svg = new DOMParser().parseFromString(t, 'text/html').querySelector('svg');

				Object.assign ( this.svg.style, {
					fill: "black",
					stroke: "black",
					strokeWidth: "1",
					marginRight: "10px",
				});

				if ( this.params?.logo?.display == "only" )
				{
					this.svg.style.maxWidth = "100%";
					this.svg.style.maxHeight = "100%";
				}
				else
				{
					this.svg.style.maxWidth = "1em";
					this.svg.style.maxHeight = "1em";
				}

				Object.assign ( this.svg.style, this.params.logo?.style );
			})
			.then ( ()=>{
				this._updateDsiplay ( );
			})
	}

	_updateDsiplay ( )
	{
		while ( this.show.firstChild )
		{
			this.show.removeChild ( this.show.lastChild );
		}

		if ( this.params?.logo?.display != false
			&& this.svg )
		{
			this.show.appendChild ( this.svg );
		}

		if ( this.params?.logo?.display != "only" )
		{
			this.show.appendChild ( this.label[ this.params.current ].cloneNode ( true ) );
		}
	}
}
