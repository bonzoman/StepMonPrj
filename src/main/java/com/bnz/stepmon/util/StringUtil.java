package com.bnz.stepmon.util;

public class StringUtil {
    /**
     * 주어진 String 객체 참조 변수가 null이거나 trim 처리후 빈 문자열("")이
     * 되는지 검사한 결과를 돌려 준다.
     *
     * @param string 검사할 String 객체 참조.
     * @return null이거나 trim후 빈 문자열("")이면 true, 그렇지 않으면 false.
     */
    public static boolean isEmpty(String string) {
        return isEmpty(string, true);
    }


    /**
     * 주어진 String 객체 참조 변수가 null이거나 afterTrim 값에 따라 trim 처리 후
     * 빈 문자열("")이 되는지 검사한 결과를 돌려 준다. afterTrim이 true이면 Trim
     * 처리 후 검사하고, false이면 Trim 처리하지 않고 검사한다.
     *
     * @param string    검사할 String 객체 참조.
     * @param afterTrim 빈 문자열("")인지 검사시 Trim 처리 후 할 것인지 여부.
     *                  true이면 처리후 검사, false이면 처리하지 않고 검사.
     * @return string이 null 이거나 afterTrim 에 따라 처리 후 빈 문자열("")이 되면 true, 그렇지 않으면 false.
     */
    public static boolean isEmpty(String string, boolean afterTrim) {
        /* null이면 비었다. */
        if (string == null) return true;

        boolean isEmpty = false;

        /* 넘어온 문자열이 null이 아니고 Trim 처리 후 빈문자열 여부를 검사하는 것이라면. */
        if (!isEmpty && afterTrim) {
            isEmpty = "".equals(string.trim());
        }

        return isEmpty;
    }
}
