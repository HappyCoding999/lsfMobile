package com.lsfmobile;

import android.annotation.SuppressLint;
import android.app.Application;

import androidx.annotation.Nullable;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;

import com.facebook.react.bridge.JSIModulePackage;
import com.yuanzhou.vlc.ReactVlcPlayerPackage;
import com.RNAppleAuthentication.AppleAuthenticationAndroidPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.lufinkey.react.spotify.RNSpotifyPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
//import com.swmansion.reanimated.ReanimatedJSIModulePackage;
//import com.swmansion.reanimated.ReanimatedPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.vonovak.AddCalendarEventPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.lufinkey.react.eventemitter.RNEventEmitterPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnative.googlecast.GoogleCastPackage;
import com.reactnativecommunity.toolbarandroid.ReactToolbarPackage;
import com.rnfs.RNFSPackage;

import org.reactnative.camera.RNCameraPackage;
import org.wonday.orientation.OrientationPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import io.branch.rnbranch.RNBranchModule;
import io.branch.rnbranch.RNBranchPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @SuppressLint("MissingPermission")
        @Override
        protected List<ReactPackage> getPackages() {
//      List<ReactPackage> packages = new PackageList(this).getPackages();
//      packages.add(new RNFirebasePackage());
//      packages.add(new RNFirebaseDatabasePackage());
//      packages.add(new RNFirebaseAuthPackage());
//      packages.add(new RNFirebaseStoragePackage());
//      packages.add(new AsyncStoragePackage());
//      return packages;
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
//            new ReanimatedPackage(),
            new ReactVlcPlayerPackage(),
                    new AppleAuthenticationAndroidPackage(),
                    new RNGoogleSigninPackage(),
                    new SafeAreaContextPackage(),
                    new RNGestureHandlerPackage(),
                    new BlurViewPackage(),
//            new AppleAuthenticationAndroidPackage(),
                    new AsyncStoragePackage(),
//                new AppCenterReactNativeAnalyticsPackage(getApplication(), getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
                    new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
                    new FBSDKPackage(),
                    new GoogleCastPackage(),
                    new ReactToolbarPackage(),
                    new RNSharePackage(),
                    new RNBranchPackage(),
                    new BackgroundTimerPackage(),
                    new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
                    new SvgPackage(),
                    new RNIapPackage(),
                    new RNSpotifyPackage(),
                    new RNEventEmitterPackage(),
                    new RNFetchBlobPackage(),
                    new RNFSPackage(),
                    new RNCameraPackage(),
                    new RNViewShotPackage(),
                    new RNUUIDGeneratorPackage(),
                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
                    new LinearGradientPackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseDatabasePackage(),
                    new RNFirebaseAuthPackage(),
                    new RNFirebaseStoragePackage(),
                    new LottiePackage(),
                    new ImagePickerPackage(),
                    new AddCalendarEventPackage(),
                    new OrientationPackage(), new CameraRollPackage(),
                    new AppCenterReactNativePackage(MainApplication.this)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        RNBranchModule.getAutoInstance(this);
        AppEventsLogger.activateApp(this);
    }
}
