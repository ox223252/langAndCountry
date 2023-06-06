"use strict";

class Translate {
	style = {};
	constructor ( className, dataJson, options = {} )
	{
		this.data = dataJson;
		this.className = className;
		this.options = options;

		if ( this.options.wait )
		{
			return;
		}
		this.update ( );
	}

	update ( )
	{
		let els = document.getElementsByClassName ( this.className );

		for ( let el of els )
		{
			let params = el.getAttribute ( "data-translate" );

			if ( undefined == params )
			{
				continue;
			}

			if ( true == el.translated )
			{
				continue;
			}
			el.translated = true;

			try{
				params = JSON.parse ( params );
			}catch(e){console.error( "JSON format error :",el,params);continue;}

			if ( undefined == params.prefix )
			{
				params.prefix = this.options.prefix;
			}

			while ( undefined != el.firstChild )
			{
				el.removeChild ( el.lastChild );
			}

			for ( let l of this.langs )
			{
				let ret = this._getText ( params.textId, l );

				if ( "select" == el.tagName.toLowerCase() )
				{
					if ( undefined == ret.length )
					{
						ret = [{t:"error",v:"error"}]
					}
					for ( let o of ret )
					{
						if ( ( undefined != params.only )
							&& !params.only.includes ( o.v ) )
						{
							continue;
						}
						let child = document.createElement ( "option" );
						child.className = params.prefix+"_"+l;
						child.innerHTML = o.t;
						child.value = o.v;
						child.setAttribute ( "data-translate-select", JSON.stringify ({lang:l}) );
						if ( undefined != o.options )
						{
							Object.assign ( child, o.options );
						}
						el.appendChild ( child );
					}

					this._setStyle ( params.textId );
				}
				else if ( ( "string" == typeof ret ) 
					|| ( undefined == ret.length ) )
				{
					let style = document.createElement ( "style" );
					style.innerHTML = "."+params.textId.replace  ( /^\w+_/, "c_" )+'{'

					let child = document.createElement ( params.domEl || "span" );
					child.className = params.prefix+"_"+l;
					child.innerHTML = ret.t || ret;
					if ( undefined != ret.options )
					{
						Object.assign ( child, ret.options );
					}
					el.appendChild ( child );
				}
				else
				{
					let child = document.createElement ( params.domEl || "span" );
					child.classList.add ( params.prefix+"_"+l );

					for ( let o of ret )
					{
						let subChild = document.createElement ( params.domEl || "span" );
						subChild.classList.add ( "class_"+params.textId );
						subChild.classList.add ( "class_"+o.v );
						subChild.innerHTML = o.f || o.t;
						if ( undefined != o.options )
						{
							Object.assign ( subChild, o.options );
						}
						child.appendChild ( subChild );
					}
					el.appendChild ( child );
				}
			}

			if ( "select" == el.tagName.toLowerCase() )
			{
				if ( undefined != params.default )
				{
					el.value = params.default;
				}

				el.addEventListener ( "change", (ev)=>{this._setStyle ( params.textId, ev.target.value );} );
				el.dispatchEvent ( new Event( "change" ) );
			}
		}
	}

	_setStyle ( mainId, sub )
	{
		if ( undefined == this.style[ mainId ] )
		{
			this.style[ mainId ] = document.createElement ( "style" );
			this.style[ mainId ].id = "style_"+mainId;
			document.head.appendChild ( this.style[ mainId ] );
		}

		this.style[ mainId ].innerHTML = "";
		this.style[ mainId ].innerHTML += '.class_'+mainId+'{display:none}\n'
		if ( undefined != sub )
		{
			this.style[ mainId ].innerHTML += '.class_'+mainId+'.class_'+sub+'{display:initial}\n'
			this.style[ mainId ].innerHTML += 'td.class_'+mainId+'.class_'+sub+'{display:table-cell}\n'
		}
		return this.style[ mainId ];
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

	_getText ( id=undefined, lang )
	{
		if ( id == undefined )
		{
			return {"t":"TODO"}
		}

		if ( this.data[ lang ] == undefined )
		{
			return {"t":"TODO"}
		}

		if ( this.data[ lang ][ id ] == undefined )
		{
			return {"t":"TODO"}
		}

		return this.data[ lang ][ id ];
	}

	get langs ( )
	{
		return Object.keys ( this.data );
	}
}