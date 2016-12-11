<?php


	// PHP 负责去连接数据库
	// 并取出数据
	// 根据需要将数据进行处理
	// 最后返回给前端 echo

	// 抓取豆瓣一刻的数据

	// phpinfo();

	// exit;

	// php 自身也可以获得当前时间

	$today = $_GET['today'];

	$url = 'https://moment.douban.com/api/stream/date/'.$today.'?alt=json&apikey=0bcf52793711959c236df76ba534c0d4&app_version=1.7.4&douban_udid=d623045db9fcb0d5243174c1bf1a675f887047c0&format=full&udid=9a34d8b038ff38971050199b0c5ee9c60c6d1ca3&version=6';

	echo file_get_contents($url);







