<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; // for mongodb/laravel-mongodb

class Test extends Model
{
    protected $connection = 'mongodb'; // Important!
    protected $collection = 'test';    // MongoDB collection name
    protected $fillable = ['name', 'role', 'created_at'];
    //public $timestamps = false;        // optional if you don't want created_at/updated_at auto
}
++