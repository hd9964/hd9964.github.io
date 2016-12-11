<?php

	// 推荐作者
	$recUrl = 'https://moment.douban.com/api/auth_authors/rec?alt=json&apikey=0bcf52793711959c236df76ba534c0d4&app_version=1.7.4&count=20&douban_udid=d623045db9fcb0d5243174c1bf1a675f887047c0&start=0&udid=9a34d8b038ff38971050199b0c5ee9c60c6d1ca3&version=6';

	// 全部作者
	$allUrl = 'https://moment.douban.com/api/auth_authors/all?alt=json&apikey=0bcf52793711959c236df76ba534c0d4&app_version=1.7.4&count=20&douban_udid=d623045db9fcb0d5243174c1bf1a675f887047c0&start=0&udid=9a34d8b038ff38971050199b0c5ee9c60c6d1ca3&version=6';

	// json字符串
	$recResult = file_get_contents($recUrl);

	// json字符串
	$allResult = file_get_contents($allUrl);

	// 可以将一个数组转成json

	// 解析成php识别的数组
	$recResult = json_decode($recResult, true);
	$allResult = json_decode($allResult, true);

	$result = array('rec'=>$recResult, 'all'=>$allResult);

	echo json_encode($result);





