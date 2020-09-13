-------------- ALL USER PASS TestPass123$$  ----------------------------------------------
--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.19
-- Dumped by pg_dump version 9.5.14

-- Started on 2018-08-31 14:46:35 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 2412 (class 0 OID 28855)
-- Dependencies: 176
-- Data for Name: Countries; Type: TABLE DATA; Schema: public; Owner: postgres
--


INSERT INTO public."Sites" ("id", "number", "price", "createdAt", "updatedAt") VALUES (default, 1, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Sites" ("id", "number", "price", "createdAt", "updatedAt") VALUES (default, 2, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Sites" ("id", "number", "price", "createdAt", "updatedAt") VALUES (default, 3, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Sites" ("id", "number", "price", "createdAt", "updatedAt") VALUES (default, 4, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

insert INTO public."Bookings" ("id", "firstName", "lastName", "SiteId", "unitType", "pets", "kids", "adults", "price", "startDate","endDate", "createdAt",  "updatedAt") VALUES (
    default,
    'Darrin',
    'Bennett',
    1,
    'travel-trailer',
    6,
    1,
    2,
    450,
    '2020-10-01 00:00:00',
    '2020-10-11 00:00:00',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);