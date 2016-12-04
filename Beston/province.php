<?php

            header("Content-Type:text/html;charset=utf-8");
            $json=file_get_contents("province.txt");
            echo $json;
?>