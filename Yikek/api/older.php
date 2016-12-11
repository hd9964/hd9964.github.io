<?php

	// echo time();

	// echo date('Y-m-d', time());

	// echo '<br>';

	// echo date('Y-m-d', strtotime('-6day', time()));

	// exit();

	$day = $_GET['day'];

	$date = date('Y-m-d', strtotime('-' . $day . 'day', time()));

	$url = 'https://moment.douban.com/api/stream/date/'.$date.'?alt=json&apikey=0bcf52793711959c236df76ba534c0d4&app_version=1.7.4&douban_udid=d623045db9fcb0d5243174c1bf1a675f887047c0&format=full&udid=9a34d8b038ff38971050199b0c5ee9c60c6d1ca3&version=6';

	// echo file_get_contents($url);

	$result = file_get_contents($url);

	// var_dump(json_decode($result, true));

	// 将json字符串解析成php数组
	$result = json_decode($result, true);

	echo json_encode(array('day'=>++$day, 'result'=>$result));






