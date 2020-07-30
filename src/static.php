<?php 

// 1. get the content Id (here: an Integer) and sanitize it properly

// 2. get the content from a flat file (or API, or Database, or ...)
// $data = json_decode(file_get_contents('https://stf-qa.cubettech.in/api/getPhoto?id=uMu8qdRlW78'));
$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
 $url = filter_input(INPUT_GET, 'shareid');
$explode = explode("/",$url);
$data = '';
$photourl = '';
$id= $explode[2]; 
if($explode[0]=='collection') {
	$photourl = 'http://stf.cubettech.in/api/shareCollections?share_id='.$id;
}
if($explode[0]=='photo-essay') {
	$photourl = 'http://stf.cubettech.in/api/sharePhotoEssay?share_id='.$id;
} 
if($explode[0]=='photo') {
	$photourl = 'http://stf.cubettech.in/api/getPhoto?id='.$id;
}
$curlSession = curl_init();
curl_setopt($curlSession, CURLOPT_URL, $photourl);
curl_setopt($curlSession, CURLOPT_BINARYTRANSFER, true);
curl_setopt($curlSession, CURLOPT_RETURNTRANSFER, true);
$jsonData = json_decode(curl_exec($curlSession));
 
curl_close($curlSession);



if($explode[0]=='collection') {
	$data = $jsonData->collection;
}
if($explode[0]=='photo-essay') {
	$data = $jsonData->essay;
}
 if($explode[0]=='photo') { 
	$data = $jsonData->uploadDetails;
}

// 3. return the page
return makePage($jsonData, $actual_link, $data);

function makePage($jsonData,$actual_link, $data) {  
	
    // 1. get the page
    $pageUrl = $actual_link;
    // 2. generate the HTML with open graph tags
    $html  = '<!doctype html>'.PHP_EOL;
    $html .= '<html>'.PHP_EOL;
    $html .= '<head>'.PHP_EOL;
    $html .= '<meta name="author" content="TEST"/>'.PHP_EOL;
    $html .= '<meta property="og:title" content="'.$data->title.'"/>'.PHP_EOL;
    $html .= '<meta property="og:description" content="'.$data->story.'"/>'.PHP_EOL;
    $html .= '<meta property="og:image" content="'.$data->media.'"/>'.PHP_EOL;
	 //$html .= '<meta property="og:url" content="'.$pageUrl.'"/>'.PHP_EOL;
    $html .= '<meta http-equiv="refresh" content="0;url='.$pageUrl.'">'.PHP_EOL;
    $html .= '</head>'.PHP_EOL;
    $html .= '<body></body>'.PHP_EOL;
    $html .= '</html>';
    // 3. return the page
    echo $html;
}
