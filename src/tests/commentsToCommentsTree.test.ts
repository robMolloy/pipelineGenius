import { cloneDeep } from "lodash";

type TComment = {
  id: string;
  content: string;
  parent: string;
};

type TCommentTree = (TComment & { children: undefined | TCommentTree })[];

const mockSimplestComments: TComment[] = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id3",
    content: "this is the third comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
];
const mockSimplestCommentsTree: TCommentTree = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: undefined,
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id3",
    content: "this is the third comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: undefined,
  },
];

const mockSimpleComments: TComment[] = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content: "this is the 2nd comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
    content: "this is the third comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
];
const mockSimpleCommentsTree: TCommentTree = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: [
      {
        id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
        content: "this is the third comment",
        parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
        children: undefined,
      },
    ],
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content: "this is the 2nd comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: undefined,
  },
];
const mockComments: TComment[] = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content: "this is the 2nd comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
    content: "this is the third comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4",
    content: "this is the fourth comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
  },
];
const mockCommentsTree: TCommentTree = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: [
      {
        id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
        content: "this is the third comment",
        parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
        children: [
          {
            id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4",
            content: "this is the fourth comment",
            parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
            children: undefined,
          },
        ],
      },
    ],
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content: "this is the 2nd comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: undefined,
  },
];

const mockComplexComments: TComment[] = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
    content: "this is the third comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4",
    content: "this is the fourth comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4_id6",
    content: "this is the 6th comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4_id7",
    content: "this is the 7th comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id5",
    content: "this is the 5th comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content:
      "this is the second comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id8",
    content:
      "this is the 8th comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "",
  },
];

const mockComplexCommentsTree: TCommentTree = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "",
    children: [
      {
        id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
        content: "this is the third comment",
        parent: "",
        children: [
          {
            id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4",
            content: "this is the fourth comment",
            parent: "",
            children: [
              {
                id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4_id6",
                content: "this is the 6th comment",
                parent: "",
                children: undefined,
              },
              {
                id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4_id7",
                content: "this is the 7th comment",
                parent: "",
                children: undefined,
              },
            ],
          },
        ],
      },
      {
        id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id5",
        content: "this is the 5th comment",
        parent: "",
        children: undefined,
      },
    ],
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content:
      "this is the second comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "",
    children: undefined,
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id8",
    content:
      "this is the 8th comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "",
    children: undefined,
  },
];

export const commentsToCommentsTree = (initComments: TComment[]) => {
  const comments = cloneDeep(initComments) as typeof initComments;
  const commentsTree: TCommentTree = [];

  const sortedComments = comments.sort((a, b) => (a.id > b.id ? 1 : -1));
  const commentTreeComments = sortedComments.map((x) => ({
    ...x,
    children: undefined as TCommentTree | undefined,
  }));

  commentTreeComments.forEach((comment) => {
    const parentId = comment.id.split("_").slice(0, -1).join("_");
    const parent = commentTreeComments.find((x) => x.id === parentId);
    if (!parent) return commentsTree.push(comment);

    // parent.children = parent.children === undefined ? [comment] : [...parent.children, comment]
    if (parent.children === undefined) parent.children = [comment];
    else parent.children.push(comment);
  });

  return commentsTree;
};

test("convert simplest comments to simplest commentsTree", () => {
  expect(commentsToCommentsTree(mockSimplestComments)).toMatchObject(mockSimplestCommentsTree);
});
test("convert simple comments to simple commentsTree", () => {
  expect(commentsToCommentsTree(mockSimpleComments)).toMatchObject(mockSimpleCommentsTree);
});
test("convert comments to commentsTree", () => {
  expect(commentsToCommentsTree(mockComments)).toMatchObject(mockCommentsTree);
});
test("convert Complex comments to Complex commentsTree", () => {
  expect(commentsToCommentsTree(mockComplexComments)).toMatchObject(mockComplexCommentsTree);
});
