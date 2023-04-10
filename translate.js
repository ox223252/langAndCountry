"use strict";

class Translate {
	constructor ( className, dataJson, options )
	{
		this.data = dataJson;

		let els = document.getElementsByClassName ( className );

		function setStyle ( mainId, sub )
		{
			let style = document.getElementById ( "style_"+mainId );
			if ( undefined == style )
			{
				style = document.createElement ( "style" );
				style.id = "style_"+mainId;
				document.head.appendChild ( style );
			}

			style.innerHTML = "";
			style.innerHTML += '.class_'+mainId+'{display:none}\n'
			if ( undefined != sub )
			{
				style.innerHTML += '.class_'+mainId+'.class_'+sub+'{display:initial}\n'
			}
			return style;
		}

		for ( let el of els )
		{
			let params = el.getAttribute ( "data-translate" );

			if ( undefined == params )
			{
				continue;
			}

			params = JSON.parse ( params );

			if ( undefined == params.prefix )
			{
				params.prefix = options.prefix;
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

					setStyle ( params.textId );
				}
				else if ( ( "string" == typeof ret ) 
					|| ( undefined == ret.length ) )
				{
					let style = document.createElement ( "style" );
					style.innerHTML = "."+params.textId.replace  ( /^\w+_/, "c_" )+'{'

					let child = document.createElement ( params.domEl || "span" );
					child.className = params.prefix+"_"+l;
					child.innerHTML = ret.t || ret;
					console.log ( ret.options )
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
						console.log ( o );
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
				el.addEventListener ( "change", (ev)=>{setStyle ( params.textId, ev.target.value );} );
				el.dispatchEvent ( new Event( "change" ) );
			}
		}
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