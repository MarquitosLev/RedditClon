package com.RedditClon_Backend.RedditClon_Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class RedditClonBackendApplication {

	public static void main(String[] args) {
		// Configurar zona horaria UTC para toda la aplicación
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		
        SpringApplication.run(RedditClonBackendApplication.class, args);
	}

}
