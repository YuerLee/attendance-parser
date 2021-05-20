'use strict';

new Vue({
  el: '#app',
  data: {
    findStudentRegex: /[0-9]{4,5}.{1,}/g,
    findWhiteSpaceWithoutLineBreakRegex: /[^\S\r\n]/g,
    total: 40,
    students: [],
    signInText: '',
    signOutText: '',
    expectedStudentsText: '',
    signInList: {},
    signOutList: {},
    absenceTotal: 0,
    lateTotal: 0,
    excusedTotal: 0,
  },
  methods: {
    parseStudentFromText(text) {
      const clearListText = text.replace(this.findWhiteSpaceWithoutLineBreakRegex, '');
      const studentTextList = clearListText.match(this.findStudentRegex) || [];

      return studentTextList.map((text) => {
        const clearText = (text || '').replace(/\s/g, '');
        const clearNumberGroup = clearText.match(/[0-9]/g);
        const classNumber = Number(clearText.slice(0, 3));
        const number = Number(clearText.slice(3, clearNumberGroup.length));
        const name = clearText.slice(clearNumberGroup.length);

        return { classNumber, number, name };
      });
    },
    findInList(student, list) {
      return list.find((signInStudent) => {
        const isSameNumber = signInStudent?.number === student?.number;
        const isSameClassNumber = !student?.classNumber || signInStudent?.classNumber === student?.classNumber;

        return isSameNumber && isSameClassNumber;
      });
    },
    findName(a, b) {
      if (!a?.name && !b?.name) {
        return undefined;
      }

      if (a?.name && b?.name) {
        if (a.name === b.name) {
          return a.name;
        }

        return `${a.name} / ${b.name}`;
      }

      return a?.name ?? b?.name;
    },
    parse: function () {
      this.signInList = this.parseStudentFromText(this.signInText);
      this.signOutList = this.parseStudentFromText(this.signOutText);

      const expectedList = this.parseStudentFromText(this.expectedStudentsText);
      const expectedTemplateList = Array.from(Array(Number(this.total)).keys()).map((index) => ({ number: index + 1 }));

      const students = (expectedList?.length ? expectedList : expectedTemplateList).map((student) => {
        const signInStudent = this.findInList(student, this.signInList);
        const signOutStudent = this.findInList(student, this.signOutList);

        const name = this.findName(signInStudent, signOutStudent);

        return { name, ...student, signIn: !!signInStudent, signOut: !!signOutStudent };
      });

      this.fullAttendanceTotal = students.filter((student) => student?.signIn && student?.signOut).length;
      this.absenceTotal = students.filter((student) => !student?.signIn && !student?.signOut).length;
      this.lateTotal = students.filter((student) => !student?.signIn && student?.signOut).length;
      this.excusedTotal = students.filter((student) => student?.signIn && !student?.signOut).length;

      this.students = students;
    },
  },
});
