// 导入样式
import '../scss/main.scss';

// 导入图片
import course1Image from '../assets/images/course1.jpg';
import course2Image from '../assets/images/course2.jpg';

// 路线数据
let routes = [];

let filters = {
    wall: 'all',    // 修改默认值为'all'表示全部
    position: 'all', // 修改默认值为'all'表示全部
    color: 'all'     // 修改默认值为'all'表示全部
};

const itemsPerPage = 6;
let currentPage = 0;

// 导航栏滚动效果
const nav = document.querySelector('.main-nav');
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(74, 74, 74, 0.95)';
    } else {
        nav.style.backgroundColor = '#4a4a4a';
    }
});

// 移动端菜单
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// 课程数据
const courses = [
    {
        title: '攀岩简介',
        image: course1Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/IkwLdYK4Eofx8wxqrMfcEiWSnCc',
        description: '发展历程、各方面概述'
    },
    {
        title: '攀岩装备',
        image: course2Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/KODQdq6VWoU5PMxyzjpcxfCqnBb',
        description: '攀岩鞋、镁粉、安全带、主锁、保护器'
    },
    {
        title: '攀岩技术',
        image: course1Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/mindnotes/TVDdbrLO9mkrzqnrbjEcrmTpnAd',
        description: '姿势、手法、脚法、对抗、平衡'
    },
    {
        title: '难度攀岩-保护',
        image: course2Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/PRpxdiKhZo69LGxJJJGcYViqndg',
        description: '五步保护法、装备介绍、进阶保护技术'
    },
    {
        title: '难度攀岩-绳结',
        image: course1Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/R4vudOmO0oMHi5xZaT8cslNcnef?from=from_copylink',
        description: '8字结、绳尾结、盘绳等'
    },
    {
        title: '难度攀岩-先锋攀爬',
        image: course2Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/VKrXdQQaQoz9ObxLmvNcVljjned',
        description: '入挂手法、攀爬和保护等'
    },
    {
        title: '攀石-下落',
        image: course1Image,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/APLQdfmXpoMbxYxg1lycXR1TnnF',
        description: '基础下落姿势、错误姿势说明等'
    }
];

// 生成课程卡片
const courseGrid = document.querySelector('.course-grid');
courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-image" style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);">
            <img src="${course.image}" alt="${course.title}">
        </div>
        <h3>${course.title}</h3>
        <p class="description">${course.description}</p>
        <a href="${course.link}" target="_blank" class="learn-btn">立即学习</a>
    `;
    courseGrid.appendChild(card);
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 加载路线数据（如果需要）
        routes = await loadRoutes();

        // 设置初始筛选按钮状态
        const filterGroups = document.querySelectorAll('.filter-options');

        // 检测是否为触摸设备
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // 检测是否为微信内置浏览器
        const isWechat = /MicroMessenger/i.test(navigator.userAgent);

        // 为每个按钮添加点击和触摸事件监听器
        filterGroups.forEach(group => {
            const buttons = group.querySelectorAll('button');

            // 微信浏览器特殊处理
            if (isWechat) {
                console.log("检测到微信浏览器，使用特殊处理");
                buttons.forEach(button => {
                    // 移除所有现有事件（防止重复绑定）
                    const buttonClone = button.cloneNode(true);
                    button.parentNode.replaceChild(buttonClone, button);

                    // 对克隆后的按钮添加事件
                    buttonClone.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        console.log("微信浏览器按钮点击:", this.textContent);

                        // 获取当前组的最新按钮集合
                        const currentGroupButtons = Array.from(group.querySelectorAll('button'));

                        // 确保清除当前组内所有按钮的active状态
                        currentGroupButtons.forEach(btn => {
                            btn.classList.remove('active');
                        });

                        // 手动添加active类
                        this.classList.add('active');

                        // 更新过滤器
                        const filterType = group.getAttribute('data-filter');
                        const filterValue = this.getAttribute('data-value');
                        filters[filterType] = filterValue;

                        // 立即更新路线
                        setTimeout(() => updateRoutes(), 0);

                        return false;
                    });
                });
            }
            // 触摸设备通用处理
            else if (isTouchDevice) {
                buttons.forEach(button => {
                    ['touchstart', 'touchend', 'click'].forEach(eventName => {
                        button.addEventListener(eventName, function (e) {
                            if (eventName === 'touchstart') {
                                e.preventDefault();
                            }

                            // 只在click或touchend事件时更改状态
                            if (eventName === 'click' || eventName === 'touchend') {
                                // 移除同组其他按钮的 active 类
                                buttons.forEach(btn => {
                                    btn.classList.remove('active');
                                });

                                // 为当前点击的按钮添加 active 类
                                this.classList.add('active');

                                const filterType = group.getAttribute('data-filter');
                                const filterValue = this.getAttribute('data-value');
                                // 更新筛选条件
                                filters[filterType] = filterValue;

                                // 更新路线显示
                                updateRoutes();
                            }
                        }, { passive: false });
                    });
                });
            }
            // 桌面设备处理（保留原有逻辑）
            else {
                group.addEventListener('click', event => {
                    if (event.target.tagName === 'BUTTON') {
                        // 移除同组其他按钮的 active 类
                        group.querySelectorAll('button').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        // 为当前点击的按钮添加 active 类
                        event.target.classList.add('active');
                        const filterType = group.getAttribute('data-filter');
                        const filterValue = event.target.getAttribute('data-value');
                        // 更新筛选条件
                        filters[filterType] = filterValue;
                        console.log('Filters:', filters);
                        // 更新路线显示
                        updateRoutes();
                    }
                });
            }
        });

        // 初始显示所有路线
        updateRoutes();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 地图初始化
const map = L.map('map').setView([30.308829, 120.086003], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker([30.308829, 120.086003])
    .addTo(map)
    .bindPopup('浙江大学攀岩墙')
    .openPopup();

// 手风琴效果
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const title = item.querySelector('h3');
    const content = item.querySelector('.content');

    title.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // 关闭所有项
        accordionItems.forEach(i => {
            i.classList.remove('open');
            i.querySelector('.content').style.maxHeight = null;
        });

        // 如果点击的项是关闭的，则打开它
        if (!isOpen) {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// 文件上传处理
const uploadBtn = document.querySelector('.upload-btn');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'video/*';

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // 处理文件上传逻辑
        console.log('Selected file:', file.name);
    }
});

// 更新路线数据
// 从CSV文件加载路线数据
async function loadRoutes() {
    try {
        //const response = await fetch('/src/video_list.csv');
        //const csvText = await response.text();
        //const lines = csvText.split('\n').slice(1); // 跳过标题行
        const lines = ['好一个棋局，让我CPU燃烧,BV1N8Q3YCExw,lead;center;mixed',
            '全程绷紧神经的感觉谁懂啊，爽,BV1FkQ3YvENi,traverse;all;all'
        ]
        return lines.map(line => {
            const [title, bv, tags] = line.split(',');
            const tagArray = tags.split(';');

            return {
                title: title,
                bvid: bv,
                wall: tagArray[0], // 默认值
                position: tagArray[1] || '', // 中间
                color: tagArray[2] || '', // 灰色
                difficulty: '', // 暂无难度信息
                description: `标签：${tagArray.join('、')}`
            };
        }).filter(route => route.title && route.bvid); // 过滤掉无效数据
    } catch (error) {
        console.error('加载视频数据失败:', error);
        return [];
    }
}

// 更新路线显示
function updateRoutes() {
    console.log('Updating routes with filters:', filters);
    console.log(routes);
    // 筛选路线
    const filteredRoutes = routes.filter(route => {
        const wallMatch = filters.wall === 'all' || route.wall === filters.wall;
        const positionMatch = filters.position === 'all' || route.position === filters.position;
        const colorMatch = filters.color === 'all' || route.color === filters.color;

        return wallMatch && positionMatch && colorMatch;
    });

    console.log('Filtered routes:', filteredRoutes);

    // 生成视频项
    const container = document.querySelector('.video-container');
    if (filteredRoutes.length === 0) {
        container.innerHTML = '<div class="no-results">没有找到符合条件的路线</div>';
        return;
    }
    container.innerHTML = '';
    filteredRoutes.forEach(route => {
        const card = document.createElement('div');
        card.className = 'video-item';

        // 添加标签中英文对照表
        const tagTranslations = {
            // 墙面类型
            wall: {
                all: '全部',
                boulder: '攀石',
                lead: '难度',
                traverse: '横移'
            },
            // 位置
            position: {
                all: '全部',
                left: '左侧',
                center: '中间',
                right: '右侧'
            },
            // 颜色
            color: {
                all: '全部',
                red: '红色',
                orange: '橙色',
                yellow: '黄色',
                blue: '蓝色',
                green: '绿色',
                purple: '紫色',
                pink: '粉色',
                brown: '棕色',
                black: '黑色',
                gray: '灰色',
                white: '白色',
                mixed: '混合'
            }
        };
        // 将英文标签转换为中文显示
        const wallType = tagTranslations.wall[route.wall] || route.wall;
        const position = tagTranslations.position[route.position] || route.position;
        const color = tagTranslations.color[route.color] || route.color;

        // 构建标签描述
        let tags = [];
        if (route.wall) tags.push(wallType);
        if (route.position) tags.push(position);
        if (route.color) tags.push(color);
        const tagDescription = tags.length > 0 ? `标签：${tags.join('、')}` : '';

        card.innerHTML = `
            <iframe src="https://player.bilibili.com/player.html?bvid=${route.bvid}&page=1&autoplay=0" 
                    scrolling="no" 
                    border="0" 
                    frameborder="no" 
                    framespacing="0" 
                    allowfullscreen="true">
            </iframe>
            <div class="route-info">
                <h4>${route.title}</h4>
                <p class="difficulty">难度：${route.difficulty || '未标记'}</p>
                <p class="color">颜色：${color}</p>   
                <p class="description">${tagDescription}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// 导航按钮事件处理
document.querySelector('.nav-button.prev').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateVideoDisplay();
    }
});

document.querySelector('.nav-button.next').addEventListener('click', () => {
    currentPage++;
    updateVideoDisplay();
});

// 初始化显示
updateVideoDisplay();