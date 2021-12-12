package com.lsfmobile;

import com.facebook.CallbackManager;
import com.facebook.react.GoogleCastActivity;
import com.facebook.react.ReactActivity;
import android.content.res.Configuration;
import io.branch.rnbranch.*;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivityDelegate;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
import com.facebook.react.modules.core.PermissionListener; // <- add this import



public class MainActivity extends GoogleCastActivity {

    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Bundle bundle = new Bundle();
                bundle.putInt("skipPaywall", BuildConfig.SKIP_PAYWALL ? 1 : 0);
                return bundle;
            }
        };
    }

    CallbackManager mCallbackManager;
    private PermissionListener listener;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "lsfmobile";
    }

    // Override onStart, onNewIntent:
    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
    
    public void setPermissionListener(PermissionListener listener)
    {
      this.listener = listener;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
      if (listener != null)
      {
        listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
      }
      super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
   public void onConfigurationChanged(Configuration newConfig) {
             super.onConfigurationChanged(newConfig);
               Intent intent = new Intent("onConfigurationChanged");
               intent.putExtra("newConfig", newConfig);
               this.sendBroadcast(intent);
    }


    @Override
    public int checkPermission(String permission, int pid, int uid) {
        return 0;
    }

    @Override
    public int checkSelfPermission(String permission) {
        return 0;
    }

    @Override
    public boolean shouldShowRequestPermissionRationale(String permission) {
        return false;
    }
}
