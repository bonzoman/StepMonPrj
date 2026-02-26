package com.bnz.stepmon.util;

import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;
import java.util.SimpleTimeZone;


public class DateUtil {

    private static final String DEFAULT_DATE_FORMAT = "yyyy/MM/dd";            // 기본 날짜 형식
    private static final String DEFAULT_DATE_NO_FORMAT = "yyyyMMdd";                // 형식없는 년월일타입
    private static final String DEFAULT_YEAR_MONTH_NO_FORMAT = "yyyyMM";                // 형식없는 년월타입
    private static final String DEFAULT_DATETIME_FORMAT = "yyyy/MM/dd HH:mm:ss:SS"; // 기본 일시 형식
    private static final Locale DEFAULT_TIME_ZONE_LOCALE = Locale.KOREA;            // 기본 Time Zone Locale

    /**
     * 오라클DB의 DATE형식 객체 생성(현재 년월일시간분초)
     *
     * @return Timestamp
     */
    public static Timestamp getCurrentTimestamp() {
        Calendar calendar = Calendar.getInstance();

        return new Timestamp(calendar.getTime().getTime());
    }

    /**
     * 현재년도를  yyyy형태로 반환한다.
     *
     * @return String
     */
    public static String getYyyy() {
        Calendar calendar = Calendar.getInstance();
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        String pattern = "yyyy";
        SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
        return formatter.format(calendar.getTime());
    }

    /**
     * 현재 날짜와 시각을  yyyyMM 형태로 반환한다.
     *
     * @return String
     */
    public static String getYyyymm() {
        Calendar calendar = Calendar.getInstance();
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        String pattern = "yyyyMM";
        SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
        return formatter.format(calendar.getTime());
    }

    /**
     * 현재 날짜와 시각을  yyyyMMdd 형태로 반환한다.
     *
     * @return String
     */
    public static String getYyyymmdd() {
        Calendar calendar = Calendar.getInstance();
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        String pattern = "yyyyMMdd";
        SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
        return formatter.format(calendar.getTime());
    }

    /**
     * 현재 날짜와 시각을 Yyyymmddhhmmss 형태로 반환한다.
     *
     * @return
     */
    public static String getYyyymmddhhmmss() {
        Calendar calendar = Calendar.getInstance();
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        String pattern = "yyyyMMddHHmmss";
        SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
        return formatter.format(calendar.getTime());
    }

    /**
     * 현재 날짜와 시각을 Yyyymmdd 형태로 반환한다.
     *
     * @param cal
     * @return
     */
    public static String getYyyymmdd(Calendar cal) {
        if (cal == null) return "";
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        String pattern = "yyyy-MM-dd";
        SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
        return formatter.format(cal.getTime());
    }

    /**
     * 현재 날짜와 시각을 인자의 pattern으로 변환한다.
     *
     * @param pattern
     * @return
     */
    public static String getNowDate(String pattern) {
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
        return formatter.format(Calendar.getInstance().getTime());
    }

    /**
     * getGregorianCalendar
     *
     * @param yyyymmdd
     * @return
     */
    public static GregorianCalendar getGregorianCalendar(String yyyymmdd) {
        if (yyyymmdd == null) return null;
        int yyyy = Integer.parseInt(yyyymmdd.substring(0, 4));
        int mm = Integer.parseInt(yyyymmdd.substring(4, 6));
        int dd = Integer.parseInt(yyyymmdd.substring(6));

        GregorianCalendar calendar = new GregorianCalendar(yyyy, mm - 1, dd, 0, 0, 0);

        return calendar;

    }

    /**
     * 지정된 플래그에 따라 연도 , 월 , 일자를 연산한다.
     * - 사용 예
     * String date = DateUtil.getOpDate(java.util.Calendar.DATE , 1, "20080101")
     *
     * @return String
     */
    public static String getOpDate(int field, int amount, String date) {

        GregorianCalendar calDate = getGregorianCalendar(date);

        if (field == Calendar.YEAR) {
            calDate.add(GregorianCalendar.YEAR, amount);
        } else if (field == Calendar.MONTH) {
            calDate.add(GregorianCalendar.MONTH, amount);
        } else {
            calDate.add(GregorianCalendar.DATE, amount);
        }

        return getYyyymmdd(calDate);

    }

    /**
     * 2009-03-10 String날짜변수를  2009-03-10 00:00:00 Timestamp 형식으로 반환한다.
     *
     * @param dateStr
     * @return
     */
    public static Timestamp replaceTimestamp(String dateStr) {
        if (dateStr == null || dateStr.length() != 10) return null;

        String year = dateStr.substring(0, 4);
        String month = dateStr.substring(5, 7);
        String day = dateStr.substring(8, 10);
//		String hh    = dateStr.substring(11, 13);
//		String mm    = dateStr.substring(14, 16);
//		String ss    = dateStr.substring(17, 18);

        Calendar calendar = Calendar.getInstance();

        calendar.set(
                Integer.parseInt(year),
                Integer.parseInt(month) - 1,
                Integer.parseInt(day),
                0,
                0,
                0
        );

        return new Timestamp(calendar.getTime().getTime());
    }

    /**
     * 20101013112322 String날짜변수를  2009-03-10 11:23:22 Timestamp 형식으로 반환한다.
     *
     * @param dateStr
     * @return
     */
    public static Timestamp replaceTimestampType1(String dateStr) {
        if (dateStr == null || dateStr.length() != 14) return null;

        String year = dateStr.substring(0, 4);
        String month = dateStr.substring(4, 6);
        String day = dateStr.substring(6, 8);
        String hh = dateStr.substring(8, 10);
        String mm = dateStr.substring(10, 12);
        String ss = dateStr.substring(12, 14);

        Calendar calendar = Calendar.getInstance();

        calendar.set(
                Integer.parseInt(year),
                Integer.parseInt(month) - 1,
                Integer.parseInt(day),
                Integer.parseInt(hh),
                Integer.parseInt(mm),
                Integer.parseInt(ss)
        );

        return new Timestamp(calendar.getTime().getTime());
    }

    /**
     * 지난 요일 일자 가져오기
     *
     * @param pYoil - 가져올 요일( 1:일 2:월 ~ 6:금 7:토 )
     * @return 해당요일의 일자 yyyyMMdd
     */
    public static String getBeforeYoilDate(int pYoil) {
        String strDate = "";
        Calendar cal = Calendar.getInstance();
        int nDayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        int nDayOfYoil = 0;

        try {

            for (int i = 1; i <= 7; i++) {
                if (nDayOfWeek == i) {
                    nDayOfYoil = pYoil - i;
                    break;
                }
            }

            if (nDayOfYoil > 0) nDayOfYoil -= 7;

            cal.add(Calendar.DATE, nDayOfYoil);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
            strDate = sdf.format(cal.getTime());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return strDate;
    }

    /**
     * getConvertYyyymmdd
     *
     * @param tmp
     * @return
     */
    public static String getConvertYyyymmdd(Timestamp tmp, String dateFormat) {
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat, Locale.KOREA);

        return sdf.format(tmp);
    }


    /**
     * 데이터 형식이 맞는지 여부 확인(param : yyyy-MM-dd)
     *
     * @param dateString
     * @return
     */
    public static boolean isDateFormat(String dateString) {
        try {
            if (dateString == null || dateString.length() != 10) {
                return false;
            }

            String year = dateString.substring(0, 4);
            String month = dateString.substring(5, 7);
            String day = dateString.substring(8, 10);

            int yearInt = Integer.parseInt(year);
            int monthInt = Integer.parseInt(month);
            int dayInt = Integer.parseInt(day);

            Calendar calendar = Calendar.getInstance();
            calendar.set(yearInt, monthInt - 1, dayInt);

            if (yearInt < 0 || monthInt < 0 || dayInt < 0) {
                return false;
            }

            if (monthInt > 12 || dayInt > 31) {
                return false;
            }

            int endDay = getLastDayOfMon(yearInt, monthInt);

            if (Integer.parseInt(day) > endDay) {
                return false;
            }

        } catch (Exception e) {
            return false;
        }

        return true;
    }

    /**
     * 입력된 년월의 마지막 날
     *
     * @param year
     * @param month
     * @return
     * @throws Exception
     */
    public static int getLastDayOfMon(int year, int month) throws Exception {
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, 1);

        return cal.getActualMaximum(Calendar.DAY_OF_MONTH);
    }

    /**
     * 입력된 해당월의 마지막 날을 반환
     * getLastDayOfMonToYYYYMMDD 기능 설명
     * <pre>
     * 메소드 상세설명 작성(생략 가능)
     * </pre>
     *
     * @param yyyyMM
     * @return YYYYMMDD
     */
    public static String getLastDayOfMonToYYYYMMDD(String yyyyMM) throws Exception {
        String lastDay = String.valueOf(getLastDayOfMon(Integer.valueOf(yyyyMM.substring(0, 4)), Integer.valueOf(yyyyMM.substring(4, 6))));

        return yyyyMM + lastDay;
    }

    /**
     * 2개 날짜(Date)사이의 날짜들 리턴
     * ex) getDatesOfRange("2010-11-30", "2010-12-02", "yyyy-MM-dd")
     * getDatesOfRange
     *
     * @param beginDate
     * @param endDate
     * @param formatStr
     * @return
     * @throws Exception
     */
    public static List<Date> getDatesOfRange(String beginDate, String endDate, String formatStr) throws Exception {
        SimpleDateFormat format = new SimpleDateFormat(formatStr);
        return getDatesOfRange(format.parse(beginDate), format.parse(endDate));
    }

    /**
     * 2개 날짜(Date)사이의 날짜들 리턴
     * getDatesOfRange
     *
     * @param beginDate
     * @param endDate
     * @return
     */
    public static List<Date> getDatesOfRange(Date beginDate, Date endDate) {
        List<Date> dates = new ArrayList<Date>();
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(beginDate);

        Calendar endDateCalendar = new GregorianCalendar();
        endDateCalendar.setTime(endDate);
        endDateCalendar.add(Calendar.DATE, 1);  // 마지막 날짜를 포함하기 위해 하루를 더함

        while (calendar.before(endDateCalendar)) {
            Date tempDate = calendar.getTime();
            dates.add(tempDate);
            calendar.add(Calendar.DATE, 1);
        }
        return dates;
    }


    public static List<String> getAddYyyy(int startYear, int addYear) {
        List<String> yearList = new ArrayList<String>();
        for (int i = 0; i < (Integer.parseInt(getYyyy()) + addYear - startYear); i++) {
            yearList.add(i, String.valueOf(startYear + i));
        }

        return yearList;
    }


    /**
     * getDate
     * 날짜 덧셈뺄셈
     *
     * @return
     */
    public static String getDate(int year, int month, int day, int cc) {
        DecimalFormat df = new DecimalFormat("00");
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month - 1, day);

        calendar.add(Calendar.DATE, cc);

        return (calendar.get(Calendar.YEAR) + "" + df.format(calendar.get(Calendar.MONTH) + 1) + "" + df.format(calendar.get(Calendar.DATE)));
    }

    /**
     * toDateFormat
     * 날짜 형식 yyyy-mm-dd
     *
     * @return
     */
    public static String toDateFormat(String dt) {
        if (dt == null) return "";
        if (dt.length() == 8) {
            return dt.substring(0, 4) + "-" + dt.substring(4, 6) + "-" + dt.substring(6, 8);
        } else {
            return dt;
        }
    }

    /**
     * 현재일자를 기본 날짜형식(DEFAULT_DATE_FORMAT)에 맞춰 가져온다.
     * <pre>
     * ex> nowDate() = "2013/06/10"
     * </pre>
     *
     * @return 현재일자
     */
    public static String nowDate() {
        return getDate(null, null, DEFAULT_DATE_FORMAT);
    }

    /**
     * 현재일시를 기본 일시형식(DEFAULT_DATETIME_FORMAT)에 맞춰 가져온다.
     * <pre>
     * ex> nowDateTime() = "2013/06/10 14:23:16:484"
     * </pre>
     *
     * @return 현재일시
     */
    public static String nowDateTime() {
        return getDate(null, null, DEFAULT_DATETIME_FORMAT);
    }

    /**
     * 현재일자를 날짜형식에 맞춰 가져온다.
     * <pre>
     * ex> getDate("yyyy/MM/dd") = 2013/06/10
     *     getDate("yyyy-MM-dd") = 2013-06-10
     * </pre>
     *
     * @param format - 적용할 날짜형식
     * @return 현재일자
     */
    public static String getDate(String format) {
        return getDate(null, null, format);
    }

    /**
     * yyyyMMdd형식의 문자열일자를 적용할 날짜형식으로 변경 반환한다.
     * <pre>
     * ex> getDate("20130611", "yyyy/MM/dd") = 2013/06/11
     *     getDate("20130612", "yyyy-MM-dd") = 2013-06-12
     * </pre>
     *
     * @param date   - 날짜형식을 적용할 일자(문자열 일자)
     * @param format - 적용할 날짜형식
     * @return 일자
     */
    public static String getDate(String date, String format) {
        return getDate(date, null, format);
    }

    /**
     * 문자열 일자를 원하는 날짜형식으로 변환하여 반환한다.
     *
     * <pre>
     * getDate("문자열일자","문자연일자의 현 날짜형식","반환할 날짜형식")
     * ex> getDate("20130610","yyyyMMdd","yyyy-MM-dd") = "2013-06-10"
     *     getDate("20130610",null,"yyyy-MM-dd") = "2013-06-10"
     *     getDate("2013-06-10","yyyy-MM-dd","yyyy-MM-dd") = "2013-06-10"
     * </pre>
     *
     * @param date      - 날짜형식을 적용할 일자(문자열 일자)
     * @param befFormat - 날짜형식을 적용할 일자의 현재 날짜 형식
     * @param aftFormat - 적용할 날짜형식
     * @return 일자
     */
    public static String getDate(String date, String befFormat, String aftFormat) {
        Locale currentLocale = new Locale("KOREAN", "KOREA");

        String befFormatTmp = befFormat;

        /* 현재날짜형식이 없는 경우는 yyyyMMdd으로만 받는다 */
        if (StringUtil.isEmpty(befFormatTmp)) befFormatTmp = DEFAULT_DATE_NO_FORMAT;

        /* 날짜 형식  */
        SimpleDateFormat befFormatter = new SimpleDateFormat(befFormatTmp, currentLocale);    // date(매개변수) 날짜형식
        SimpleDateFormat aftFormatter = new SimpleDateFormat(aftFormat, currentLocale);    // 반환할 날짜형식

        /* 문자열 일자가 존재하지 않을 경우 현재일을 반환한다. */
        if (StringUtil.isEmpty(date)) {
            Calendar now = Calendar.getInstance(DEFAULT_TIME_ZONE_LOCALE);
            return aftFormatter.format(now.getTime());
        }

        /* 문자열일자와 문자열일자 날짜형식의 길이가 같지 않는 경우 null반환한다. */
        if (date.length() != befFormatTmp.length()) return null;

        /* 문자열 일자를 데이트타입으로 변경할 변수 */
        Date parseDate = null;

        /* 문자열일자 Date Type으로 변경 */
        try {
            parseDate = befFormatter.parse(date);
        } catch (Exception e) {
            /* 타입변경 에러는 null을 반환한다 */
            e.printStackTrace();
            return null;
        }

        /* 적용할 날짜형식으로 반환 */
        return aftFormatter.format(parseDate);
    }


    /**
     * 개월수 구하기
     * <pre>
     * Oracle의 MONTHS_BETWEEN(TO_DATE(SUBSTR(?,1,6),'YYYYMM'), TO_DATE(SUBSTR(?,1,6),'YYYYMM')) 과 동일
     *
     * ex> DateUtil.monthsBetweenAsOracle("20131015", "20130725") => 3
     *     DateUtil.monthsBetweenAsOracle("201310"  , "201307"  ) => 3 (일자부분 무시됨)
     *     DateUtil.monthsBetweenAsOracle("20130515", "20130725") => -2
     * </pre>
     *
     * @param p_toMonth 종료일자(월) YYYYMMDD or YYYMM
     * @param p_frMonth 시작일자(월) YYYYMMDD or YYYMM
     * @return 개월수
     */
    public static int monthsBetweenAsOracle(String p_toMonth, String p_frMonth) {
        int bitFlg = 1;
        int iYear = 0; //계산된 년도
        int iMonth = 0; //계산된 개월수
        int rMonth = 0; //반환할 개월수
        String frMonth = p_frMonth;
        String toMonth = p_toMonth;

        if (Integer.parseInt(p_frMonth) > Integer.parseInt(p_toMonth)) {
            frMonth = p_toMonth;
            toMonth = p_frMonth;
            bitFlg = -1;
        }

        iYear = Integer.parseInt(toMonth.substring(0, 4)) - Integer.parseInt(frMonth.substring(0, 4));
        iMonth = Integer.parseInt(toMonth.substring(4, 6)) - Integer.parseInt(frMonth.substring(4, 6));

        rMonth = (12 * iYear) + iMonth;
        return rMonth * bitFlg;
    }

    /**
     * 현재 시간을 기준으로 몇 일후 시간
     * 시간의 형태는 (yyyy/mm/dd)
     *
     * @param day 더하려는 날짜
     * @return str      현재 시간에 입력 시간을 더한 DATE형 시간
     */
    public static String getDatewithSpan(long day) {
        String sDate = getKST("yyyyMMdd");
        DecimalFormat dFormat = new DecimalFormat("00");
        int iYear = Integer.parseInt(sDate.substring(0, 4));
        int iMonth = Integer.parseInt(sDate.substring(4, 6));
        int iDay = Integer.parseInt(sDate.substring(6, 8));
        GregorianCalendar cal = new GregorianCalendar();
        cal.set(iYear, iMonth - 1, iDay);
        int iDays = (int) day;
        cal.add(Calendar.DATE, iDays);
        // 월은 0base이다.
        long result = Long.parseLong(Integer.toString(cal.get(Calendar.YEAR))
                + dFormat.format(cal.get(Calendar.MONTH) + 1)
                + dFormat.format(cal.get(Calendar.DATE)));
        return String.valueOf(result);
    }

    /**
     * 현재(한국기준) 시간정보를 얻는다.                     <BR>
     * (예) 입력파리미터인 format string에 "yyyyMMddhh"를 셋팅하면 1998121011과 같이 Return.  <BR>
     * (예) format string에 "yyyyMMddHHmmss"를 셋팅하면 19990114232121과 같이
     * 0~23시간 타입으로 Return. <BR>
     * String CurrentDate = CmUtil.getKST("yyyyMMddHH");<BR>
     *
     * @param format 얻고자하는 현재시간의 Type
     * @return str       현재 한국 시간.
     */

    public static String getKST(String format) {
        //1hour(ms) = 60s * 60m * 1000ms
        int millisPerHour = 60 * 60 * 1000;
        Locale currentLocale = new Locale("KOREAN", "KOREA");
        SimpleDateFormat fmt = new SimpleDateFormat(format, currentLocale);

        SimpleTimeZone timeZone = new SimpleTimeZone(9 * millisPerHour, "KST");
        fmt.setTimeZone(timeZone);

        long time = System.currentTimeMillis();
        String str = fmt.format(new Date(time));
        return str;
    }


}
