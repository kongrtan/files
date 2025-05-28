package com.example.demo.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    @GetMapping("/print-info")
    public Map<String, Object> printRequestInfo(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();

        // 🍪 쿠키 출력
        Map<String, String> cookies = new HashMap<>();
        Cookie[] cookieArr = request.getCookies();
        if (cookieArr != null) {
            for (Cookie cookie : cookieArr) {
                cookies.put(cookie.getName(), cookie.getValue());
            }
        }
        result.put("cookies", cookies);

        // 🔍 쿼리 스트링 파라미터 출력
        Map<String, String> queryParams = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String name = paramNames.nextElement();
            queryParams.put(name, request.getParameter(name));
        }
        result.put("queryParams", queryParams);

        return result;
    }
}
