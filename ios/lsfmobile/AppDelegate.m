/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import "AppCenterReactNativeCrashes.h"
#import "AppCenterReactNativeAnalytics.h"
#import "AppCenterReactNative.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "Orientation.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTLinkingManager.h>
#import <AVFoundation/AVFoundation.h>
#import <react-native-branch/RNBranch.h>
#import <GoogleCast/GoogleCast.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@import Firebase;


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 
  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];  // Initialize AppCenter crashes
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];  // Initialize AppCenter analytics
  [AppCenterReactNative register];  // Initialize AppCenter
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
  
  
  // branch initialization
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  BranchEvent *event = [BranchEvent customEventWithName:@"App launch"];
  event.customData = [[NSDictionary alloc] initWithObjectsAndKeys:@"Test Event",@"Test key", nil];
  event.alias = @"my custom alias";
  [event logEvent];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  NSString * skipPaywall = @"0";
  #ifdef SKIP_PAYWALL
    skipPaywall = @"1";
  #endif
  
  NSDictionary *props = @{@"skipPaywall": skipPaywall };
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                               moduleName:@"lsfmobile"
                                              initialProperties:props];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [FIRApp configure];  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    return [Orientation getOrientation];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
  if (@available(iOS 14, *)) {
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
      dispatch_async(dispatch_get_main_queue(), ^{
        switch (status) {
          case ATTrackingManagerAuthorizationStatusAuthorized:
            NSLog(@"Ad tracking request allowed");
            [FBSDKSettings setAdvertiserTrackingEnabled:YES];
            break;
          case ATTrackingManagerAuthorizationStatusDenied:
            NSLog(@"Ad tracking request denied");
            [FBSDKSettings setAdvertiserTrackingEnabled:NO];
            break;
          default:
            break;
        }
      });
    }];
  } else {
    // Fallback on earlier versions
  };
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options; {
  
  BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options];
  
  BOOL handledRCT = [RCTLinkingManager application:app openURL:url options:options];
  
  if (![RNBranch.branch application:app openURL:url options:options]) {
      // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
  }
  
  return handledFB || handledRCT;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    return [RNBranch continueUserActivity:userActivity];
}

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize Google Cast
  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:kGCKDefaultMediaReceiverApplicationID];
  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
//  options.disableDiscoveryAutostart = true;
//  [options setStartDiscoveryAfterFirstTapOnCastButton:false];
  [GCKCastContext setSharedInstanceWithOptions:options];
  return YES;
}
@end
