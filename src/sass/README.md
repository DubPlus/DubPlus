
### SASS info

Icon fonts are from:  http://fontawesome.io/icons/

####Roles

There are 3 roles that get styling

* DubPlus Team - anyone involved in helping create or promote Dub+
* VIP - People who have donated to Dub+
* Owners - The creators of Dub+

To add stylings for one of these roles you can use one of these mixins

```sass
// DubPlus Team
@include addRole("team", "USER_NAME", "USER_ID");

// VIP
@include makeVIP("USER_NAME", "USER_ID");

// Owner
@include makeOwner("USER_NAME", "USER_ID");
```

Each of these mixins can also take 2 extra arguments to override the icon and color that are set in `variables.scss`.    

Example:

```sass
// do NOT include the "\" when including a custom icon
@include makeVIP("USER_NAME", "USER_ID", "f192", "#00aeff");
```