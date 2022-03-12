<?php

class config
{
    private $configs;
    
    public function __construct($config)
    {
        $this->configs = include("config/{$config}.php");
    }

    public function get($key)
    {
        if (!empty($this->configs[$key])) {
            return $this->configs[$key];
        }
        return null;
    }
}
