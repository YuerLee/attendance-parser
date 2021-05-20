'use strict';

const app = new Vue({
  el: '#app',
  data: {
    regex: /[0-9]{5}.{1,}/g,
    total: 40,
    students: [],
    signInText: '',
    signOutText: '',
    signInList: {},
    signOutList: {},
    absenceTotal: 0,
    lateTotal: 0,
    excusedTotal: 0,
  },
  methods: {
    parse: function () {
      this.students = [];
      this.signInList = {};
      this.signOutList = {};

      this.signInList = (this.signInText.match(this.regex) || [])
        .map((text) => {
          const clearText = (text || '').replace(/\s/g, '');
          const classNumber = clearText.slice(0, 3);
          const number = clearText.slice(3, 5);
          const name = clearText.slice(5);

          return { classNumber, number, name };
        })
        .sort((a, b) => a.number - b.number);

      this.signOutList = (this.signOutText.match(this.regex) || [])
        .map((text) => {
          const clearText = (text || '').replace(/\s/g, '');
          const classNumber = clearText.slice(0, 3);
          const number = clearText.slice(3, 5);
          const name = clearText.slice(5);

          return { classNumber, number, name };
        })
        .sort((a, b) => a.number - b.number);

      const students = Array.from(Array(this.total).keys());

      this.signInList.forEach((student) => {
        const index = Number(student.number) - 1;
        students[index] = { ...students[index], ...student, signIn: true };
      });

      this.signOutList.forEach((student) => {
        const index = Number(student.number) - 1;
        students[index] = { ...students[index], ...student, signOut: true };
      });

      this.absenceTotal = students.filter((student) => student?.number == undefined).length;
      this.lateTotal = students.filter((student) => !student?.signIn && student?.signOut).length;
      this.excusedTotal = students.filter((student) => student?.signIn && !student?.signOut).length;

      this.students = students;

      console.log(this.students);
    },
  },
});
