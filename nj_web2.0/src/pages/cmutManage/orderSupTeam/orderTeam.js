/**
 * Created by Aaron on 2018/1/19.
 */
const orderTeam = {
  namespaced: true,
  state: {
    // 主表数据
    mainTable: [],
    // 团队名称
    teamName: '',
    // 子表1数据
    childTable1: [],
    childTable2: [],
    // 主表id
    mainId: '',
    // 子表1id
    childId1: '',
    childId2: '',
    index: 0,
  },
  mutations: {
    setMainTable(state, value) {
      state.mainTable = value
    },
    addNewArrayMainTable(state, res) {
      state.mainTable.unshift(res)
    },
    updateArrayMainTable(state, res) {
      if (state.mainTable.length === 0) {
        state.mainTable.push(res)
      } else {
        state.mainTable.splice(state.index, 1, res)
      }
    },
    setChildTable1(state, value) {
      state.childTable1 = value
    },
    addNewArrayChildTable1(state, res) {
      state.childTable1.unshift(res)
    },
    updateArrayChildTable1(state, res) {
      if (state.childTable1.length === 0) {
        state.childTable1.push(res)
      } else {
        state.childTable1.splice(state.index, 1, res)
      }
    },
    setChildTable2(state, value) {
      state.childTable2 = value
    },
    addNewArrayChildTable2(state, res) {
      state.childTable2.unshift(res)
    },
    updateArrayChildTable2(state, res) {
      if (state.childTable2.length === 0) {
        state.childTable2.push(res)
      } else {
        state.childTable2.splice(state.index, 1, res)
      }
    },
    setIndex(state, value) {
      state.index = value
    },
    setMainId(state, value) {
      state.mainId = value
    },
    setChildId1(state, value) {
      state.childId1 = value
    },
    setChildId2(state, value) {
      state.childId2 = value
    },
    setTeamName(state, value) {
      state.teamName = value
    },
  },
}

export default orderTeam
