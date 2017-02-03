# Step 9: Getting Bootstrap CSS Theme for a nicer Look and Feel
As the last step here we will make our page look much nicer. To accomplish this, we will use 
[Bootstrap](http://getbootstrap.com/).
 
We can install Bootstrap with the following command (executed in `imageupload_frontend/static/`):
```bash
npm install bootstrap@3
```

Now we just need to include the `node_modules/bootstrap/dist/css/bootstrap.min.css` in `index.html`:
```HTML
<head>
    ...
    
    <!-- Include Bootstrap CSS -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
</head>
```

## Styling the page
First we are going to wrap the upload form into a panel, and also style the button with CSS classes look nicer:
```HTML
<!-- Main Div -->
<div class="container-fluid">
    <div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
        <!-- Panel for Uploading a new Image -->
        <div class="panel panel-default">
            <div class="panel-body">
                <form class="form" name="form" ng-submit="uploadImage()">
                    <label for="inputFile">Select Image:</label>
                    <input id="inputFile" type="file" files-model="newImage.image">
                    <br />
                    <button class="btn btn-primary" type="submit">
                        Upload
                    </button>
                </form>
            </div>
        </div>
        ...
    </div>
</div>
```


Second we are going to add an info text in case there are no images available, by making use of `ng-if`:
```HTML
<div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
    ...
    <div ng-if="images.length == 0">
        There are no images available yet.
    </div>
    ...
</div>
```


Last but not least we are going to use Bootstraps responsive grid for displaying images in a row with several columns:
```HTML
<div class="container-fluid">
    <div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
        ...
    
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4" ng-repeat="image in images track by image.pk">
                <h3>
                    Image {{ image.pk }}
                    <button class="btn btn-warning" ng-click="deleteImage(image)">Delete</button>
                </h3>
                <a href="{{ image.image }}">
                    <img class="img-responsive" ng-src="{{ image.image }}">
                </a>
            </div>
        </div>
    </div>
</div>
```

The final result should be a page that is functional and has a nice(r) look and feel.