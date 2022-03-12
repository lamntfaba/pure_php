<?php

class sqlite
{
    protected $connection;
    protected $showErrors = true;
    
    public function __construct($host, $showErrors = true)
    {
        $this->connection = new PDO("sqlite:$host");
        $this->logError();
        $this->showErrors = $showErrors;
    }
    
    public function query($query)
    {
        $result = $this->connection->query($query);
        if (!$result) {
            $this->logError();
        }

        return $result;
    }
    
    public function fetchArray($query)
    {
        $data = [];
        $result = $this->query($query);
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }
    
    public function logError()
    {
        if ($this->showErrors && $this->connection->errorCode()) {
            exit(print_r($this->connection->errorInfo()));
        }
    }
}