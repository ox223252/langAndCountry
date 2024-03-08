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
				let eventMnger = (ev)=>{popup.style.display = (ev.type=="mouseenter")?"flex":"none";};

				let popup = document.createElement ( "div" );
				popup.style.display = "none";
				popup.style.position = "absolute";
				popup.style.flexDirection = "column";
				popup.style.backgroundColor = "white";
				popup.style.padding = "10px";
				popup.style.border = "solid 1px black";
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

				let main = document.createElement ( "div" );
				main.style.display = "inline-block";
				main.onmouseenter = eventMnger;
				main.onmouseleave = eventMnger;

				main.appendChild ( this.show );
				main.appendChild ( popup );
				this.params.target.appendChild ( main );

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
		return this.params.target
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

		async function loadData ( path )
		{
			return new Promise ((ok,ko)=>{
				fetch ( path )
					.then(r=>r.json())
					.then(ok)
			});
		}

		loadData ( path + "langs.json" )
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

		if ( undefined == this.params.logoSize )
		{
			this.params.logoSize = 20;
		}

		this.show.style.backgroundImage = "url(\""+path+"lang.png\")";
		this.show.style.backgroundSize = (this.params.logoSize*0.75) + 'px';
		this.show.style.backgroundPositionX = "left";
		this.show.style.backgroundPositionY = "top";
		this.show.style.backgroundColor = "transparent";
		this.show.style.backgroundRepeat = "no-repeat";
		this.show.style.paddingLeft = this.params.logoSize + "px";
	}
}
