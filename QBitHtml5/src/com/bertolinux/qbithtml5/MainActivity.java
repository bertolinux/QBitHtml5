package com.bertolinux.qbithtml5;

import org.apache.cordova.DroidGap;

import android.os.Bundle;

@SuppressWarnings("deprecation")
public class MainActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState); 
		loadUrl("file:///android_asset/www/index.html"); 
        // Disable scrollbars 
        super.appView.setVerticalScrollBarEnabled(false);
        super.appView.setHorizontalScrollBarEnabled(false);
	}   
} 
