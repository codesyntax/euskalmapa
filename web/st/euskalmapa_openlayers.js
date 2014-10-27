var map;

function handleResize()
{
	if ($('searchresults'))
	{
	    //$("#map").animate({marginLeft: "-=250px", }, 800 );
        
        $("#map").css('left', "200px");
        $("#map").css('width', "84%");

		//$('map').style.width = (document.documentElement.clientWidth > 0?document.documentElement.clientWidth:document.documentElement.offsetWidth) - 200;
	    //$('#map').css('marginleft','200px'); // = (document.documentElement.clientWidth > 0?document.documentElement.clientWidth:document.documentElement.offsetWidth) - 200;
		//$('report').style.width = (document.documentElement.clientWidth > 0?document.documentElement.clientWidth:document.documentElement.offsetWidth) - 200;
	}
	else
	{
		$('map').style.width = (document.documentElement.clientWidth > 0?document.documentElement.clientWidth:document.documentElement.offsetWidth) - 0;
		$('map').style.left = 0;
		
	}
	
	//if ($('map')) $('map').style.height = (document.documentElement.clientHeight > 0?document.documentElement.clientHeight:document.documentElement.offsetHeight) - 38;
	//if ($('searchresults')) $('searchresults').style.height = (document.documentElement.clientHeight > 0?document.documentElement.clientHeight:document.documentElement.offsetHeight) - 38;
	//if ($('report')) $('report').style.height = (document.documentElement.clientHeight > 0?document.documentElement.clientHeight:document.documentElement.offsetHeight) - 38;
}
window.onresize = handleResize;

function panToLatLon(lat,lon) {
	var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	map.panTo(lonLat, 2);
}

function panToLatLonZoom(lat,lon, zoom) {
	var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	if (zoom != map.getZoom())
		map.setCenter(lonLat, zoom);
	else
		map.panTo(lonLat, 10);
}

function panToLatLonBoundingBox(lat,lon,minlat,maxlat,minlon,maxlon,points) {
        
        
        var proj_EPSG4326 = new OpenLayers.Projection("EPSG:4326");
        var proj_map = map.getProjectionObject();
                map.zoomToExtent(new OpenLayers.Bounds(minlon,minlat,maxlon,maxlat).transform(proj_EPSG4326, proj_map));

                var pointList = [];
                var style = {
                        strokeColor: "#75ADFF",
                        fillColor: "#F0F7FF",
                        strokeWidth: 2,
                        strokeOpacity: 0.75,
                        fillOpacity: 0.15,
                        externalGraphic: "http://www.openstreetmap.org/openlayers/img/marker.png"

                };
                var proj_EPSG4326 = new OpenLayers.Projection("EPSG:4326");
                var proj_map = map.getProjectionObject();
	
    
	    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		
	    var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openstreetmap.org/openlayers/img/marker.png',size,offset);
		layerMarkers.addMarker(new OpenLayers.Marker(lonLat,icon));
	
	if (points)
	{
	        pointlist = []
	        $.each(points,function(p){ 
	    	    pointList.push(new OpenLayers.Geometry.Point(points[p][0],points[p][1]));
	    	    });
	    	
            var linearRing = new OpenLayers.Geometry.LinearRing(pointList).transform(proj_EPSG4326, proj_map);;
	        //var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]),null,style);
	        var polygonFeature = new OpenLayers.Feature.Vector(linearRing,null,style);
            vectorLayer.destroyFeatures();
        	vectorLayer.addFeatures([polygonFeature]);
	}
	else
	{
	    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		
		
	    var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openstreetmap.org/openlayers/img/marker.png',size,offset);
		layerMarkers.addMarker(new OpenLayers.Marker(lonLat,icon));

	    var point = new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat);
		var pointFeature = new OpenLayers.Feature.Vector(point,null,style);
		vectorLayer.destroyFeatures();
		vectorLayer.addFeatures([pointFeature]);
	}
}

function round(v,n)
{
	n = Math.pow(10,n);
	return Math.round(v*n)/n;
}
function floor(v,n)
{
	n = Math.pow(10,n);
	return Math.floor(v*n)/n;
}
function ceil(v,n)
{
	n = Math.pow(10,n);
	return Math.ceil(v*n)/n;
}

function mapEventMove() {
	var proj = new OpenLayers.Projection("EPSG:4326");
	var bounds = map.getExtent();
	bounds = bounds.transform(map.getProjectionObject(), proj);
	$('viewbox').value = floor(bounds.left,2)+','+ceil(bounds.top,2)+','+ceil(bounds.right,2)+','+floor(bounds.bottom,2);
}

function init() {
		//handleResize();
		map = new OpenLayers.Map ("map", {
            controls:[
									new OpenLayers.Control.Navigation(),
									new OpenLayers.Control.Permalink(),
									new OpenLayers.Control.PanZoomBar(),
									new OpenLayers.Control.MouseDefaults(),
									new OpenLayers.Control.MousePosition(),
									new OpenLayers.Control.Attribution()],
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
            maxResolution: 156543.0399,
            numZoomLevels: 19,
            units: 'm',
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            eventListeners: {"moveend": mapEventMove}} );
		map.addLayer(new OpenLayers.Layer.OSM.Mapnik("Mapnik"));

		var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
		layer_style.fillOpacity = 0.2;
		layer_style.graphicOpacity = 1;
		vectorLayer = new OpenLayers.Layer.Vector("Points", {style: layer_style});
		map.addLayer(vectorLayer);
		layerMarkers = new OpenLayers.Layer.Markers("Markers");
	    map.addLayer(layerMarkers);



    $("#address").keypress(function(e){
        if(e.which==13) $("#btnSubmit").click();
        });
        
      
      setPermalinkAndParams()
      
}
function setPermalinkAndParams()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
        if (hash[0]=='q')
        {
            var address = new Object();
            address.address = hash[1];
            search_values(hash[1]);
            $('#address').val(hash[1]);
        }
    }
    // not any permalink parameter
    if (hashes.length == 1)
    {
        panToLatLonZoom(20, 0, 3);
    }    
    return vars;
}

function setfocus(field_id) { 
	$(field_id).focus();
} 


function user_submit() {
    var address = new Object();
    address.address = document.getElementById('address').value;
    search_values(document.getElementById('address').value)
    //setDefaultTileServer();
}		


function search_values(search_value) {
    $.getJSON("http://nominatim.openstreetmap.org/search?q="+ search_value +"&polygon=1&format=json&json_callback=?",
    function(data){
      $('#places_list').html('');
      removeResultsDiv();
      addresultsDiv();
      handleResize();
      
      if (data.length > 0)
      {    
            //vectorLayer.clearMarkers();
            //$('#map_canvas').css('width: 700px;');
            $.each(data, function(i,item){
            
            if (i==0)
            {
                panToLatLonBoundingBox(item.lat, item.lon,item.boundingbox[0],item.boundingbox[1],item.boundingbox[2],item.boundingbox[3]);
            }
            
            if (item.icon)
            {             
                     
                text = '<div class="result" onClick="panToLatLonBoundingBox('+item.lat+', '+item.lon+', '+item.boundingbox+', [';
                $.each(item.polygonpoints, function(p){
                    text = text + '['+item.polygonpoints[p]+'],';                
                });
                  
                text = text + ']);" ><img src="'+ item.icon +'">';
            }  
            else
            {
                text = '<div class="result" onClick="panToLatLonBoundingBox('+item.lat+', '+item.lon+', '+item.boundingbox+', '+ item.polygonpoints +');" >';
            } 
            text = text +'<span class="name">'+ item.display_name +'</span> <span class="latlon">'+item.lat+','+ item.lon+'</span> <span class="place_id">'+ item.osm_id+'</span><span class="type">('+ item.type +')</span></div>';                 
            $(text).appendTo("#places_list");});
      }
      else
      {
            text = '<ul><li"><p>Ez da tokirik izen horrekin</p></li></ul>'
            $(text).appendTo("#places_list");
       }      
    });
}         

function addresultsDiv()
{
    text = '<div id="searchresults" ><div><a href="#" onclick="removeResultsDiv();">itxi</a></div><div id="places_list"></div></div>';
    $(text).appendTo('#container');
}

function removeResultsDiv()
{
   $("#map").css('left', "0px");
   $("#map").css('width', "100%");
   $('#searchresults').remove();
}