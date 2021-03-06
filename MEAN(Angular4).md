## MEAN (Angular4)
### Build a new app

ng new ngApp --routing

ng serve -o

ng build

### Express Server

npm install --save express body-parser

### server.js
add file **src/server.js**

```
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const api = require('./server/routes/api');

const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, function () {
  console.log("Server running on localhost:" + port);
});

```
NOTE: you may need to change javascript version to ES6 in webstorm and turn on Nodejs support as well in preferences

**ngApp/server/router/api.js**

```
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('api works');
});

module.exports = router;

```
test it with

```
node server
```

open localhost:3000 you should see landing page

localhost:3000/api

you should see "api works"


## mLab for MongoDB
visit mlab.com and setup an free account. Follow same instructions given in "what I know about Node" tutorial/blog post on github

## mongoose

```
npm install --save mongoose
```

ngApp/server/models/video.js

```
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: String,
  url: String,
  description: String
});

module.exports = mongoose.model('video', videoSchema, 'videos');

```
## BUILDING CRUD
Using Postman to test along the way

**ngApp/server/routes/api.js**

```
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = require('../models/video');


const db = "mongodb://userfonso:smallsecret@ds249575.mlab.com:49575/videoplayer777";

mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
  if(err){
    console.error("Error! " + err);
  }
});

router.get('/videos', function (req, res) {
  console.log('Get request for all videos');
  Video.find({})
    .exec(function(err, videos){
      if(err){
        console.log("error retrieving videos");
      }else{
        res.json(videos);
      }
    });
});

router.get('/videos/:id', function (req, res) {
  console.log('Get request for single video');
  Video.findById(req.params.id)
    .exec(function(err, video){
      if(err){
        console.log("error retrieving video");
      }else{
        res.json(video);
      }
    });
});

router.post('/video', function(req,res){
  console.log('Post a video');
  let newVideo = new Video();
  newVideo.title = req.body.title;
  newVideo.url = req.body.url;
  newVideo.description = req.body.description;
  newVideo.save(function(err, insertedVideo){
    if(err){
      console.log('Error saving video');
    }else{
      res.json(insertedVideo);
    }
  });
});


router.put('/video/:id', function (req, res) {
  console.log('Update a video');
  Video.findByIdAndUpdate(req.params.id,
    {
      $set: {title: req.body.title, url: req.body.url, description: req.body.description}
    },
    {
      new: true
    },
    function(err, updatedVideo){
      if(err){
        res.send("Error updating video");
      }else{
        res.json(updatedVideo);
      }
    });
});


router.delete('/video/:id', function(req, res){
  console.log('Deleting a video');
  Video.findByIdAndRemove(req.params.id, function(err, deletedVideo){
    if(err){
      res.send("Error deleting video");
    }else{
      res.json(deletedVideo);
    }
  });
});


module.exports = router;

```
ng g c home

ng g c videoCenter

**src/app/app-routing.module.ts**

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideoCenterComponent } from './video-center/video-center.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'videos', component: VideoCenterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

```

## Bootstrap

npm install --save bootstrap

**ngApp/.angular-cli.json**

```
      "styles": [
        "styles.css",
        "../node_modules/bootstrap/dist/css/bootstrap.min.css"
      ],
```
## WORK THE UI

src/app/app.component.html

```
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">VideoPlayer</a>
    </div>
    <ul class="nav navbar-nav">
      <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
      <li><a routerLink="/videos" routerLinkactive="active">Playlist</a></li>
    </ul>
  </div>
</nav>
<div class="container">
  <router-outlet></router-outlet>
</div>

```
## TESTING RESULTS SO FAR

so the server finds the changes ...

ng build

Now open Localhost:3000 and you should see the UI change

## MORE STUFF

ng g c videoList

ng g c videoDetail

change these in **video-list.component.ts** and **video-detail.component.ts**

app-video-detail => video-detail

app-video-list => video-list

video-center.component.html

```
<div class="row">
  <div class="col-sm-9">
    <video-detail></video-detail>
  </div>
  <div class="col-sm-3">
    <video-list></video-list>
  </div>
</div>

```


home.component.html

```
<div class="jumbotron">
  <h1>Video Player</h1>
</div>

```

ng build


## VIDEO CLASS

ng g cl Video

**video.ts**

```
export class Video {
  _id: string;
  title: string;
  url: string;
  description: string;
}

```

**video-center.componenet.ts**

```
import { Component, OnInit } from '@angular/core';
import { Video} from '../video';

@Component({
  selector: 'app-video-center',
  templateUrl: './video-center.component.html',
  styleUrls: ['./video-center.component.css']
})
export class VideoCenterComponent implements OnInit {
  videos: Video[] = [
    {'_id': '1', 'title': 'Title 1', 'url': 'url 1', 'description': 'desc 1'},
    {'_id': '2', 'title': 'Title 2', 'url': 'url 2', 'description': 'desc 2'},
    {'_id': '3', 'title': 'Title 3', 'url': 'url 3', 'description': 'desc 31'},
    {'_id': '4', 'title': 'Title 4', 'url': 'url 4', 'description': 'desc 4'},
  ];

  constructor() { }

  ngOnInit() {
  }

}

```

Use property data-binding

video-center.component.html

```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css'],
  inputs: ['videos']
})
export class VideoListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

video-list.component.html

```
<ul class="nav nav-pills nav-stacked">
  <li (click)="onSelect(video)" *ngFor="let video of videos"><a>{{video.title}}</a></li>
</ul>

```

updating video-list.component.ts

```
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Video } from '../video';

@Component({
  selector: 'video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {

  @Input() videos;
  @Output() SelectedVideo;
  public SelectVideo = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onselect(vid: Video) {
    this.SelectVideo.emit(vid);
  }
}

```

now include the event in video-center.component.html

```
<div class="row">
  <div class="col-sm-9">
    <video-detail></video-detail>
  </div>
  <div class="col-sm-3">
    <video-list (SelectedVideo)="onSelectVideo($event)" [videos]="videos"></video-list>
  </div>
</div>

```

now let's access the particular video

video-center.component.ts

```
import { Component, OnInit } from '@angular/core';
import { Video} from '../video';

@Component({
  selector: 'app-video-center',
  templateUrl: './video-center.component.html',
  styleUrls: ['./video-center.component.css']
})
export class VideoCenterComponent implements OnInit {
  videos: Video[] = [
    {'_id': '1', 'title': 'Title 1', 'url': 'url 1', 'description': 'desc 1'},
    {'_id': '2', 'title': 'Title 2', 'url': 'url 2', 'description': 'desc 2'},
    {'_id': '3', 'title': 'Title 3', 'url': 'url 3', 'description': 'desc 31'},
    {'_id': '4', 'title': 'Title 4', 'url': 'url 4', 'description': 'desc 4'},
  ];

  selectedVideo: Video;
  constructor() { }

  ngOnInit() {
  }
  onSelectedVideo(video: any ) {
    this.selectedVideo = video;
    console.log(this.selectedVideo);
  }

}
```
